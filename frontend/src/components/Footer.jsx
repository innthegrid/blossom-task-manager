const Footer = () => {
  return (
    <footer className="bg-white border-t border-blossom-bg mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blossom-pink rounded-full flex items-center justify-center">
              <span className="text-xl">🌸</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-blossom-dark">
              Blossom
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-blossom-soft text-sm">
              Grow your goals, one petal at a time
            </p>
            <p className="text-blossom-soft/70 text-xs mt-1">
              Made with 🩷 and 🧋 by Ingrid
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-blossom-bg text-center">
          <p className="text-blossom-soft/60 text-sm">
            This is a learning project. Your data is stored locally.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer