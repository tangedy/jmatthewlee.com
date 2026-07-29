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

function App() {
  const [phase, setPhase] = useState<AppPhase>('idle')
  const { viewportRef, trackRef, activeSection, scrollToSection } = useHorizontalScroll(
    phase === 'active',
  )

  useEffect(() => {
    if (phase !== 'entering') return

    const transitionTimer = window.setTimeout(() => setPhase('active'), 2350)
    return () => window.clearTimeout(transitionTimer)
  }, [phase])

  return (
    <main className="engineering-app" data-phase={phase}>
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
        <SectionNav activeSection={activeSection} onNavigate={scrollToSection} />
      )}
      {phase !== 'active' && (
        <LandingGate phase={phase} onEnter={() => setPhase('entering')} />
      )}
    </main>
  )
}

export default App
