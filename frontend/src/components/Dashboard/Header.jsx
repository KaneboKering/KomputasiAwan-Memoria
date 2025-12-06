import { BookOpen, LogOut } from 'lucide-react'
import Button from '../Shared/Button'

const Header = ({ onLogout }) => {
  const userEmail = localStorage.getItem('userEmail')

  return (
    <header className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Memoria</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm opacity-90">Selamat datang,</p>
              <p className="font-semibold">{userEmail}</p>
            </div>
            
            <Button
              variant="ghost"
              onClick={onLogout}
              icon={<LogOut className="w-5 h-5" />}
              className="bg-white/20 hover:bg-white/30 border-white text-white"
            >
              <span className="hidden md:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header