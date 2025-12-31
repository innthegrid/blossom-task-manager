import { useState } from 'react'
import { LogIn, Mail, Lock } from 'lucide-react'
import { authService } from '../services/authService'
import ImageLogo from '../components/ImageLogo'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login({ email, password })
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <ImageLogo size="xlarge" showText={false} />
        </div>
        <h1 className="text-3xl font-heading text-blossom-dark mb-2">
          Welcome Back
        </h1>
        <p className="text-blossom-pink">
          Sign in to tend to your Blossom Garden!
        </p>
      </div>

      {/* Login Card */}
      <div className="card-blossom">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blossom-dark">
              <Mail className="h-4 w-4 text-blossom-dark" />
              <span>Email Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-blossom w-full"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blossom-dark">
              <Lock className="h-4 w-4 text-blossom-dark" />
              <span>Password</span>
            </label>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-blossom w-full"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-blossom-red-bg border border-red-100 rounded-lg">
              <p className="text-blossom-red-text text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-blossom flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-blossom-pink text-sm">
            Don't have a garden yet?{' '}
            <a
              href="/register"
              className="text-blossom-pink hover:text-blossom-dark font-medium"
            >
              Sign up here!
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage