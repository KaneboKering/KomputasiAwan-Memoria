import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'

const AuthPage = ({ setIsAuthenticated, showNotification }) => {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-purple-400 p-12 text-white flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Memoria</h1>
            </div>
            <p className="text-xl leading-relaxed opacity-90">
              Simpan momen berharga Anda dalam catatan harian yang aman dan mudah diakses dari mana saja. 
              Mulai menulis cerita hidup Anda hari ini!
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Catatan pribadi yang aman</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Akses dari mana saja</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Tambahkan foto dan mood</span>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="p-12">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-white text-blue-500 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-500 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daftar
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm 
                setIsAuthenticated={setIsAuthenticated}
                showNotification={showNotification}
              />
            ) : (
              <RegisterForm 
                showNotification={showNotification}
                switchToLogin={() => setActiveTab('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage