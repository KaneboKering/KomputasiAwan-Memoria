const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  className = '',
  disabled = false,
  icon 
}) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-blue-500 hover:to-purple-500 shadow-soft hover:shadow-lg',
    secondary: 'bg-beige-200 text-gray-700 hover:bg-beige-100 shadow-soft',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-soft',
    ghost: 'bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-50'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

export default Button