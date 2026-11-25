import assert from 'node:assert/strict'
import { test } from 'node:test'
import axios from 'axios'
import api from '../src/api/axiosConfig.js'

function rejectUnauthorized(config) {
  return Promise.reject(new axios.AxiosError('Unauthorized', undefined, config, undefined, {
    status: 401,
  }))
}

function setup(t) {
  const storage = new Map([
    ['accessToken', 'expired-access'],
    ['refreshToken', 'existing-refresh'],
    ['user', '{}'],
  ])
  const originalAdapter = api.defaults.adapter
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const location = { href: '/dashboard' }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  })
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location } })

  t.after(() => {
    api.defaults.adapter = originalAdapter
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
    else delete globalThis.localStorage
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else delete globalThis.window
  })

  return { storage, location }
}

test('concurrent protected requests refresh once and retry with the new access token', async (t) => {
  const { storage, location } = setup(t)
  const seenAuthorization = []
  api.defaults.adapter = async (config) => {
    const authorization = config.headers.get('Authorization')
    seenAuthorization.push(authorization)
    if (authorization !== 'Bearer new-access') return rejectUnauthorized(config)
    return { data: config.url }
  }
  const refresh = t.mock.method(axios, 'post', async (url, body) => {
    assert.equal(url, '/auth/refresh')
    assert.deepEqual(body, { refreshToken: 'existing-refresh' })
    return { data: { accessToken: 'new-access' } }
  })

  const responses = await Promise.all([api.get('/tasks'), api.get('/categories')])
  assert.deepEqual(responses.map(({ data }) => data), ['/tasks', '/categories'])
  assert.deepEqual(seenAuthorization, [
    'Bearer expired-access', 'Bearer expired-access', 'Bearer new-access', 'Bearer new-access',
  ])
  assert.equal(refresh.mock.callCount(), 1)
  assert.equal(storage.get('accessToken'), 'new-access')
  assert.equal(storage.get('refreshToken'), 'existing-refresh')
  assert.equal(location.href, '/dashboard')
})

test('a login rejection is returned to the login form without refreshing', async (t) => {
  const { storage, location } = setup(t)
  api.defaults.adapter = rejectUnauthorized
  const refresh = t.mock.method(axios, 'post')

  await assert.rejects(api.post('/auth/login'), { message: 'Unauthorized' })
  assert.equal(refresh.mock.callCount(), 0)
  assert.equal(storage.get('refreshToken'), 'existing-refresh')
  assert.equal(location.href, '/dashboard')
})

test('a rejected refresh clears the session and redirects to login', async (t) => {
  const { storage, location } = setup(t)
  api.defaults.adapter = rejectUnauthorized
  t.mock.method(axios, 'post', () => rejectUnauthorized())

  await assert.rejects(api.get('/tasks'), { message: 'Unauthorized' })
  assert.equal(storage.size, 0)
  assert.equal(location.href, '/login')
})

test('a refresh response arriving after logout cannot reauthenticate or retry', async (t) => {
  const { storage, location } = setup(t)
  const send = t.mock.fn(rejectUnauthorized)
  api.defaults.adapter = send
  t.mock.method(axios, 'post', async () => {
    storage.clear()
    return { data: { accessToken: 'new-access' } }
  })

  await assert.rejects(api.get('/tasks'), { code: 'ERR_CANCELED' })
  assert.equal(send.mock.callCount(), 1)
  assert.equal(storage.size, 0)
  assert.equal(location.href, '/dashboard')
})

test('a temporary refresh failure leaves the session available for another attempt', async (t) => {
  const { storage, location } = setup(t)
  api.defaults.adapter = rejectUnauthorized
  const networkError = new axios.AxiosError('Network unavailable', 'ERR_NETWORK')
  t.mock.method(axios, 'post', async () => { throw networkError })

  await assert.rejects(api.get('/tasks'), { code: 'ERR_NETWORK' })
  assert.equal(storage.get('accessToken'), 'expired-access')
  assert.equal(storage.get('refreshToken'), 'existing-refresh')
  assert.equal(location.href, '/dashboard')
})

test('a retried request that still returns 401 does not trigger another refresh', async (t) => {
  setup(t)
  const send = t.mock.fn(rejectUnauthorized)
  api.defaults.adapter = send
  const refresh = t.mock.method(axios, 'post', async () => ({
    data: { accessToken: 'new-access' },
  }))

  await assert.rejects(api.get('/tasks'), { message: 'Unauthorized' })
  assert.equal(send.mock.callCount(), 2)
  assert.equal(refresh.mock.callCount(), 1)
})
