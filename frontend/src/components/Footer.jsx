import ImageLogo from './ImageLogo'

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ImageLogo size="small" showText={false} />
            <span className="ml-2 text-lg font-heading font-semibold text-blossom-dark">
              Blossom
            </span>
          </div>
          <div className="text-center md:text-center">
            <p className="text-blossom-pink text-sm">
              This is a learning project. Your data is stored locally.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-blossom-pink text-sm">
              Grow your goals, one bud at a time
            </p>
            <p className="text-blossom-pink text-xs mt-1">
              Made with ♥︎ by Ingrid
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer