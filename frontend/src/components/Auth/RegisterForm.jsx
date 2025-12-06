import { useState } from 'react'
import { User, Mail, Lock, UserPlus } from 'lucide-react'
import { authService } from '../../services/api'
import Input from '../Shared/Input'
import Button from '../Shared/Button'

const RegisterForm = ({ showNotification, switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      showNotification('Password tidak cocok!', 'error')
      return
    }

    setLoading(true)

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      showNotification('Registrasi berhasil! Silakan login 🎉', 'success')
      switchToLogin()
      
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Registrasi gagal. Coba lagi.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="johndoe"
        required
        icon={<User className="w-5 h-5" />}
      />

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

      <Input
        label="Konfirmasi Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
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
        icon={<UserPlus className="w-5 h-5" />}
      >
        {loading ? 'Memproses...' : 'Daftar Sekarang'}
      </Button>
    </form>
  )
}

export default RegisterForm