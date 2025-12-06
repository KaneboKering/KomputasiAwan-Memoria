import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import { authService } from '../../services/api'
import Input from '../Shared/Input'
import Button from '../Shared/Button'

const LoginForm = ({ setIsAuthenticated, showNotification }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.login(formData)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('userEmail', data.user.email)
      localStorage.setItem('userId', data.user.id)
      
      setIsAuthenticated(true)
      showNotification('Login berhasil! Selamat datang kembali 🎉', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="nama@email.com"
        required
        icon={<Mail className="w-5 h-5" />}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
        icon={<Lock className="w-5 h-5" />}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-6"
        disabled={loading}
        icon={<LogIn className="w-5 h-5" />}
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  )
}

export default LoginForm