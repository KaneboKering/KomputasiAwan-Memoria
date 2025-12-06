import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const Notification = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const style = types[type] || types.success

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.border} border-l-4 rounded-lg shadow-lg p-4 min-w-[300px] flex items-center gap-3`}>
        {style.icon}
        <p className={`${style.text} font-medium flex-1`}>{message}</p>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Notification