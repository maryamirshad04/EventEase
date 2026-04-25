import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Decorative */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rotate-45 bg-wine/10 rounded-2xl" />
          <div className="absolute inset-3 rotate-45 bg-champagne rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-wine opacity-30">404</span>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sandGold">✦</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <h1 className="font-display text-2xl font-bold text-maroon mb-3">
          Page Not Found
        </h1>
        <p className="text-textMid text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to planning your events.
        </p>

        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
