import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const location = useLocation()
  const hideNavbarRoutes = ['/login', '/register', '/signup']
  const showNavbar = !hideNavbarRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-blossom-bg">
      {showNavbar && <Navbar />}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
