const variants = {
  primary:   'bg-maroon text-offWhite hover:bg-wine border border-transparent shadow-sm hover:shadow-md',
  secondary: 'bg-champagne text-maroon border border-border hover:bg-sandGold/40',
  ghost:     'bg-transparent text-maroon border border-border hover:bg-champagne',
  danger:    'bg-burgundy text-offWhite border border-transparent hover:bg-wine shadow-sm',
  outline:   'bg-transparent text-wine border border-wine hover:bg-wine hover:text-offWhite',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-md gap-2',
  lg: 'px-7 py-3 text-base rounded-lg gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-sandGold focus:ring-offset-2',
        'active:scale-[0.97]',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        (disabled || loading) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
