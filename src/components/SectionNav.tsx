import { Moon, Sun } from 'lucide-react'
import type { SectionId } from '../hooks/useHorizontalScroll'

const navigationItems: { id: SectionId; number: string; label: string }[] = [
  { id: 'home', number: '01', label: 'Home' },
  { id: 'about', number: '02', label: 'About' },
  { id: 'projects', number: '03', label: 'Projects' },
  { id: 'links', number: '04', label: 'Links' },
]

type SectionNavProps = {
  activeSection: SectionId
  theme: 'light' | 'dark'
  onNavigate: (section: SectionId) => void
  onToggleTheme: () => void
}

export function SectionNav({ activeSection, theme, onNavigate, onToggleTheme }: SectionNavProps) {
  const themeLabel = theme === 'dark' ? 'Use light mode' : 'Use dark mode'
  const keyboardTheme = theme === 'dark' ? 'light' : 'dark'

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
      <button
        type="button"
        className="theme-toggle"
        aria-label={themeLabel}
        aria-pressed={theme === 'dark'}
        data-label={themeLabel}
        title={`${themeLabel} (or type "${keyboardTheme}")`}
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? (
          <Sun size={14} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Moon size={14} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </nav>
  )
}