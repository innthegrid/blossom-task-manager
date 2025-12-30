import { useState } from 'react'
import {
    Home,
    CheckSquare,
    PlusCircle,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { authService } from '../services/authService'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = authService.getCurrentUser()

    const handleLogout = () => {
        authService.logout()
        window.location.href = '/login'
    }

    const navLinks = [
        { name: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" /> },
        { name: 'Tasks', href: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
        { name: 'New Task', href: '/tasks/new', icon: <PlusCircle className="w-5 h-5" /> },
    ]

    return (
        <nav className="bg-white shadow-blossom sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-10 h-10 bg-blossom-pink rounded-full flex items-center justify-center">
                                <span className="text-2xl">🌸</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-blossom-dark hidden sm-block">
                                Blossom
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-blossom-soft hover:text-blossom-pink px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blossom-mint rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-blossom-dark" />
                                        </div>
                                        <spam className="text-sm text-blossom-dark">
                                            {user.username || user.email.split('@')[0]}
                                        </spam>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-blossom-outline py-2 px-4 text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <a
                                    href="/login"
                                    className="btn-blossom py-2 px-4 text-sm"
                                >
                                    Sign In
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-blossom-soft hover:text-blossom-pink hover:bg-blossom-bg focus:outline-none transition-colors"
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
                                className="text-blossom-soft hover:text-blossom-pink hover:bg-blossom-bg block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center gap-3"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon}
                                {link.name}
                            </a>
                        ))}
                        {user ? (
                            <>
                                <div className="px-4 py-3 border-t border-blossom-bg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blossom-mint rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-blossom-dark" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blossom-dark">
                                                {user.username || user.email.split('@')[0]}
                                            </p>
                                            <p className="text-xs text-blossom-soft">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-blossom-soft hover:text-blossom-pink hover:bg-blossom-bg pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center gap-3"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <a
                                href="/login"
                                className="block text-center mx-4 my-2 btn-blossom"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </a>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar