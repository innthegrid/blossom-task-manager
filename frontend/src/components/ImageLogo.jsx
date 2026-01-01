import { Link } from 'react-router-dom'

let LogoImage = null

try {
  LogoImage = new URL('../assets/images/logo.png', import.meta.url).href
} catch (error) {
  console.log('Logo image not found, using fallback emoji:', error.message)
}

const ImageLogo = ({ size = 'medium', showText = true, className = '' }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl'
  }

  // Text size variants
  const textClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  }

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 no-underline hover:opacity-90 transition-opacity ${className}`}
    >
      {/* Logo Container */}
      <div className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden`}>
        {LogoImage ? (
          <img 
            src={LogoImage}
            alt="Blossom Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, show fallback
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = '<span class="text-white">🌸</span>'
            }}
          />
        ) : (
          // Fallback emoji with gradient background
          <div className="w-full h-full bg-gradient-to-br from-blossom-pink to-blossom-dark flex items-center justify-center">
            <span className="text-white">🌸</span>
          </div>
        )}
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

export default ImageLogo