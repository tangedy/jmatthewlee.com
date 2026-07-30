import { useEffect, useState } from 'react'
import './portfolio.css'
import { CircuitBackdrop } from './components/CircuitBackdrop'
import { LandingGate } from './components/LandingGate'
import { SectionNav } from './components/SectionNav'
import { SignalWave } from './components/SignalWave'
import { useHorizontalScroll } from './hooks/useHorizontalScroll'
import {
  AboutSection,
  HomeSection,
  LinksSection,
  ProjectsSection,
} from './sections/PortfolioSections'

type AppPhase = 'idle' | 'entering' | 'active'
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const savedTheme = window.localStorage.getItem('portfolio-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [phase, setPhase] = useState<AppPhase>('idle')
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const { viewportRef, trackRef, activeSection, scrollToSection } = useHorizontalScroll(
    phase === 'active',
  )

  useEffect(() => {
    if (phase !== 'entering') return

    const transitionTimer = window.setTimeout(() => setPhase('active'), 2350)
    return () => window.clearTimeout(transitionTimer)
  }, [phase])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    let typedSequence = ''

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isEditable =
        target instanceof HTMLElement &&
        target.matches('input, textarea, [contenteditable="true"]')
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isEditable) return

      if (event.key.length !== 1) {
        typedSequence = ''
        return
      }

      typedSequence = `${typedSequence}${event.key.toLowerCase()}`.slice(-4)
      if (typedSequence !== 'dark') return

      setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
      typedSequence = ''
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main className="engineering-app" data-phase={phase} data-theme={theme}>
      <div
        className="horizontal-viewport"
        ref={viewportRef}
        aria-hidden={phase === 'idle'}
        inert={phase !== 'active'}
      >
        <CircuitBackdrop />
        <SignalWave className="home-signal-residue" />
        <div className="horizontal-track" ref={trackRef}>
          <HomeSection onViewProjects={() => scrollToSection('projects')} />
          <AboutSection />
          <ProjectsSection />
          <LinksSection />
        </div>
      </div>

      {phase === 'active' && (
        <SectionNav
          activeSection={activeSection}
          theme={theme}
          onNavigate={scrollToSection}
          onToggleTheme={toggleTheme}
        />
      )}
      {phase !== 'active' && (
        <LandingGate phase={phase} onEnter={() => setPhase('entering')} />
      )}
    </main>
  )
}

export default App
