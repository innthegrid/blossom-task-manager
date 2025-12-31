import { Link } from 'react-router-dom'

const Logo = ({ size = 'medium', showText = true }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  // Text size variants
  const textClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  }

  return (
    <Link to="/" className="flex items-center gap-3 no-underline hover:opacity-90 transition-opacity">
      {/* Logo Container */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blossom-pink to-blossom-dark flex items-center justify-center overflow-hidden`}>
        <span className="text-white text-lg">🌸</span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-heading font-bold text-blossom-dark ${textClasses[size]}`}>
          Blossom
        </span>
      )}
    </Link>
  )
}

export default Logo