import { useEffect, useRef } from 'react'
import { budgetBarColor } from '../../utils/calcBudget'

export default function ProgressBar({ percent = 0, label, showPercent = true, height = 'h-3' }) {
  const fillRef = useRef(null)
  const clamped = Math.min(percent, 100)
  const barColor = budgetBarColor(percent)

  useEffect(() => {
    if (fillRef.current) {
      // Trigger animation by setting width after mount
      requestAnimationFrame(() => {
        if (fillRef.current) {
          fillRef.current.style.width = `${clamped}%`
        }
      })
    }
  }, [clamped])

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-textMid">{label}</span>}
          {showPercent && (
            <span className={`text-xs font-semibold ${percent >= 100 ? 'text-burgundy' : percent >= 60 ? 'text-caramel' : 'text-olive'}`}>
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-champagne rounded-full overflow-hidden ${height}`}>
        <div
          ref={fillRef}
          style={{ width: '0%', transition: 'width 0.6s ease-out' }}
          className={`${height} rounded-full ${barColor}`}
        />
      </div>
      {percent > 100 && (
        <p className="text-xs text-burgundy mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          Over budget by {percent - 100}%
        </p>
      )}
    </div>
  )
}
