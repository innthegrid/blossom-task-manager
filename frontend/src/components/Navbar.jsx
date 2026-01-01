import { useState } from 'react'
import {
  Home,
  Archive,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { authService } from '../services/authService'
import ImageLogo from './ImageLogo'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/login'
  }

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Archive', href: '/archive', icon: <Archive className="w-5 h-5" /> },
  ]

  return (
    <nav className="bg-white shadow-blossom sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ImageLogo size="small" showText={false} />
            <span className="ml-2 text-2xl font-heading font-bold text-blossom-dark hidden sm:block">
              Blossom
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-blossom-pink hover:text-blossom-dark px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>

          {/* User Section - User/Logout */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blossom-green-bg rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blossom-green-text" />
                </div>
                <span className="text-sm text-blossom-dark">
                  {user?.username || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-blossom-outline py-2 px-4 text-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blossom-pink hover:text-blossom-dark hover:bg-blossom-bg focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-blossom-bg">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-blossom-pink hover:text-blossom-dark hover:bg-blossom-bg block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </a>
            ))}
            <div className="px-4 py-3 border-t border-blossom-bg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blossom-green-bg rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blossom-green-text" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blossom-dark">
                    {user?.username || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-blossom-pink">{user?.email || ''}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-blossom-pink hover:text-blossom-dark hover:bg-blossom-bg pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
