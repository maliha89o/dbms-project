import { Outlet } from 'react-router'
import Navbar from '../components/navbar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
        <Navbar />
        <Outlet />
    </div>
  )
}

export default MainLayout