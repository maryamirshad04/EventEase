export default function TemplateCard({ template, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className={[
        'relative w-full rounded-xl overflow-hidden transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-sandGold focus:ring-offset-2',
        'hover:shadow-md hover:scale-[1.02]',
        isSelected
          ? 'ring-2 ring-wine ring-offset-2 shadow-md scale-[1.02]'
          : 'shadow-sm border border-border',
      ].join(' ')}
    >
      {/* Template preview thumbnail */}
      <div
        className="aspect-[2/3] w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: template.bgColor || '#F5EDD8' }}
      >
        {/* Decorative preview content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center gap-1">
          <div
            className="w-8 h-0.5 mb-1 opacity-60"
            style={{ background: template.accentColor }}
          />
          <p className="font-display text-xs font-bold leading-tight opacity-90"
             style={{ color: template.primaryColor, fontFamily: template.fontFamily }}>
            {template.sampleLine1}
          </p>
          <p className="text-[9px] opacity-60 leading-tight"
             style={{ color: template.primaryColor }}>
            {template.sampleLine2}
          </p>
          <div
            className="w-6 h-0.5 mt-1 opacity-60"
            style={{ background: template.accentColor }}
          />
        </div>
        {/* Decorative corner pattern */}
        <div className="absolute top-1.5 left-1.5 w-4 h-4 opacity-20"
          style={{ borderTop: `2px solid ${template.accentColor}`, borderLeft: `2px solid ${template.accentColor}` }} />
        <div className="absolute top-1.5 right-1.5 w-4 h-4 opacity-20"
          style={{ borderTop: `2px solid ${template.accentColor}`, borderRight: `2px solid ${template.accentColor}` }} />
        <div className="absolute bottom-1.5 left-1.5 w-4 h-4 opacity-20"
          style={{ borderBottom: `2px solid ${template.accentColor}`, borderLeft: `2px solid ${template.accentColor}` }} />
        <div className="absolute bottom-1.5 right-1.5 w-4 h-4 opacity-20"
          style={{ borderBottom: `2px solid ${template.accentColor}`, borderRight: `2px solid ${template.accentColor}` }} />
      </div>

      {/* Selected tick */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-wine flex items-center justify-center">
          <svg className="w-3 h-3 text-offWhite" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Name label */}
      <div className="px-2 py-2 bg-offWhite border-t border-border">
        <p className="text-xs font-medium text-textMid text-center truncate">{template.name}</p>
      </div>
    </button>
  )
}
