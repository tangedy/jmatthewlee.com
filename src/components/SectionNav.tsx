import type { SectionId } from '../hooks/useHorizontalScroll'

const navigationItems: { id: SectionId; number: string; label: string }[] = [
  { id: 'home', number: '01', label: 'Home' },
  { id: 'about', number: '02', label: 'About' },
  { id: 'projects', number: '03', label: 'Projects' },
  { id: 'links', number: '04', label: 'Links' },
]

type SectionNavProps = {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
}

export function SectionNav({ activeSection, onNavigate }: SectionNavProps) {
  return (
    <nav className="section-nav" aria-label="Portfolio sections">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activeSection === item.id ? 'is-active' : ''}
          aria-label={`Go to ${item.label}`}
          aria-current={activeSection === item.id ? 'page' : undefined}
          data-label={item.label}
          onClick={() => onNavigate(item.id)}
        >
          <span>{item.number}</span>
        </button>
      ))}
    </nav>
  )
}