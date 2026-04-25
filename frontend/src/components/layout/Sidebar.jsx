export default function Sidebar({ children, className = '' }) {
  return (
    <aside className={`w-full lg:w-80 xl:w-96 flex-shrink-0 ${className}`}>
      {children}
    </aside>
  )
}
