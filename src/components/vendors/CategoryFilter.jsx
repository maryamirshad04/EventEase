export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={[
            'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-sandGold focus:ring-offset-1',
            active === cat
              ? 'bg-maroon text-offWhite shadow-sm'
              : 'bg-champagne text-textMid border border-border hover:bg-sandGold/30 hover:border-sandGold/50',
          ].join(' ')}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
