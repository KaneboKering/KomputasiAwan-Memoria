const Input = ({ 
  label, 
  type = 'text', 
  name,
  value, 
  onChange, 
  placeholder,
  required = false,
  icon
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} bg-white border-2 border-gray-200 rounded-xl 
                     focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-300 outline-none`}
        />
      </div>
    </div>
  )
}

export default Input