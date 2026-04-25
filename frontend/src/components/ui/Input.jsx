const baseInput = [
  'w-full px-4 py-2.5 rounded-md bg-offWhite text-textDark placeholder-textLight',
  'border border-border',
  'focus:outline-none focus:ring-2 focus:ring-sandGold focus:border-sandGold',
  'disabled:opacity-40 disabled:cursor-not-allowed',
  'transition-colors duration-150 text-sm',
].join(' ')

const errorInput = 'border-burgundy focus:ring-burgundy focus:border-burgundy'

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  hint,
  id,
  ...rest
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`
  const inputClass = `${baseInput} ${error ? errorInput : ''} ${className}`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-textMid">
          {label}
          {required && <span className="text-burgundy ml-0.5">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${inputClass} resize-none`}
          {...rest}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          {...rest}
        />
      )}

      {hint && !error && (
        <p className="text-xs text-textLight">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-burgundy flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
