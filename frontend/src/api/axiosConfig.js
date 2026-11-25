import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

let pendingRefresh

function refreshAccessToken(refreshToken) {
  if (pendingRefresh?.token === refreshToken) {
    return pendingRefresh.promise
  }

  const promise = axios.post('/auth/refresh', { refreshToken }, {
    baseURL: api.defaults.baseURL,
    timeout: api.defaults.timeout,
  }).then(({ data }) => data.accessToken).finally(() => {
    if (pendingRefresh?.promise === promise) pendingRefresh = undefined
  })

  pendingRefresh = { token: refreshToken, promise }
  return promise
}

function clearSession() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

api.interceptors.request.use((config) => {
  const sessionToken = localStorage.getItem('refreshToken')
  if (config._retry && config.sessionToken !== sessionToken) {
    throw new axios.CanceledError('Session changed before request retry')
  }
  config.sessionToken = sessionToken
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

api.interceptors.response.use(undefined, async (error) => {
  const request = error.config
  if (error.response?.status !== 401 || !request || request._retry ||
    request.url === '/auth/login' || request.url === '/auth/register') {
    throw error
  }

  const rejectedAuthorization = request.headers.get('Authorization')
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  if (request.sessionToken !== refreshToken) throw error
  request._retry = true

  if (!refreshToken) {
    clearSession()
    throw error
  }

  // A concurrent request may have already refreshed this session.
  if (!accessToken || rejectedAuthorization === `Bearer ${accessToken}`) {
    try {
      const newAccessToken = await refreshAccessToken(refreshToken)
      if (localStorage.getItem('refreshToken') !== refreshToken) {
        throw new axios.CanceledError('Session changed while refreshing')
      }
      localStorage.setItem('accessToken', newAccessToken)
    } catch (refreshError) {
      if (localStorage.getItem('refreshToken') === refreshToken &&
        [401, 404].includes(refreshError.response?.status)) {
        clearSession()
      }
      throw refreshError
    }
  }

  // The request interceptor attaches the latest access token on retry.
  return api(request)
})

export default api
