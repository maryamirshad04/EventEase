const colorMap = {
  wine:       'bg-wine/10 text-wine border border-wine/20',
  maroon:     'bg-maroon/10 text-maroon border border-maroon/20',
  burgundy:   'bg-burgundy/10 text-burgundy border border-burgundy/20',
  caramel:    'bg-caramel/15 text-caramel border border-caramel/20',
  sandGold:   'bg-sandGold/15 text-caramel border border-sandGold/30',
  champagne:  'bg-champagne text-textMid border border-border',
  olive:      'bg-olive/10 text-olive border border-olive/20',
  upcoming:   'bg-olive/10 text-olive border border-olive/20',
  past:       'bg-champagne text-textLight border border-border',
  Catering:      'bg-caramel/15 text-caramel border border-caramel/25',
  Photography:   'bg-wine/10 text-wine border border-wine/20',
  Decor:         'bg-sandGold/15 text-caramel border border-sandGold/30',
  Venue:         'bg-maroon/10 text-maroon border border-maroon/20',
  Entertainment: 'bg-olive/10 text-olive border border-olive/20',
  Florist:       'bg-burgundy/10 text-burgundy border border-burgundy/20',
  Food:          'bg-caramel/15 text-caramel border border-caramel/25',
  Miscellaneous: 'bg-champagne text-textMid border border-border',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({ label, color = 'champagne', size = 'md', className = '' }) {
  const colorClass = colorMap[color] || colorMap[label] || colorMap.champagne
  return (
    <span className={`inline-flex items-center font-medium rounded-sm ${sizes[size]} ${colorClass} ${className}`}>
      {label}
    </span>
  )
}
