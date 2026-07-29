import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Box,
  Contact,
  ExternalLink,
  GitBranch,
  Mail,
} from 'lucide-react'
import { contactLinks, profile, projects, type Project } from '../data/portfolio'

type HomeSectionProps = {
  onViewProjects: () => void
}

function SignalPlot() {
  return (
    <div className="signal-plot" aria-hidden="true">
      <div className="plot-readout">
        <span>V(n001)</span>
        <span>FFT / 48 kHz</span>
      </div>
      <svg viewBox="0 0 760 190" preserveAspectRatio="none">
        <path className="plot-grid-line" d="M0 48 H760 M0 95 H760 M0 142 H760" />
        <path className="plot-grid-line" d="M95 0 V190 M190 0 V190 M285 0 V190 M380 0 V190 M475 0 V190 M570 0 V190 M665 0 V190" />
        <path
          className="plot-trace plot-trace-cyan"
          d="M0 146 C30 144 46 136 62 128 S91 106 108 106 S132 132 148 132 S174 80 194 80 S222 146 242 146 S268 49 292 49 S320 150 344 150 S372 91 397 91 S423 131 448 131 S472 115 495 115 S521 124 548 124 S580 118 610 118 S650 121 690 121 S730 119 760 119"
        />
        <path
          className="plot-trace plot-trace-green"
          d="M0 160 C70 158 102 153 140 149 S205 144 250 140 S315 135 365 133 S430 130 488 128 S570 126 640 126 S710 125 760 124"
        />
        <path
          className="plot-trace plot-trace-magenta"
          d="M0 174 C110 172 166 166 225 160 S330 151 420 147 S560 142 760 140"
        />
      </svg>
      <div className="plot-axis-labels">
        <span>0Hz</span>
        <span>6kHz</span>
        <span>12kHz</span>
        <span>18kHz</span>
        <span>24kHz</span>
      </div>
    </div>
  )
}

type ProjectMediaProps = {
  project: Project
  eager: boolean
}

function ProjectMedia({ project, eager }: ProjectMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const [animationReady, setAnimationReady] = useState(!project.poster)

  useEffect(() => {
    const media = mediaRef.current
    if (!media || !project.poster) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setAnimationReady(true)
        observer.disconnect()
      },
      { rootMargin: '320px' },
    )

    observer.observe(media)
    return () => observer.disconnect()
  }, [project.poster])

  return (
    <div className="project-media" ref={mediaRef}>
      <img
        src={animationReady ? project.image : project.poster}
        alt={project.imageAlt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
      />
      <span className="media-crosshair media-crosshair-a" />
      <span className="media-crosshair media-crosshair-b" />
    </div>
  )
}

export function HomeSection({ onViewProjects }: HomeSectionProps) {
  return (
    <section id="home" className="portfolio-section home-section relative flex-none overflow-hidden">
      <div className="section-index" aria-hidden="true">
        01 / HOME
      </div>
      <div className="home-copy">
        <p className="signal-kicker">MTRX // WATERLOO</p>
        <h1 aria-label="Matthew Lee">
          <span>Matthew</span>
          <span>Lee</span>
        </h1>
        <p className="home-bio">{profile.shortBio}</p>
        <button type="button" className="inline-command" onClick={onViewProjects}>
          View projects <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="home-instrument">
        <figure className="portrait-console">
          <div className="portrait-screen">
            <img src={profile.homePortrait} alt="Matthew Lee" draggable="false" />
            <span className="screen-coordinate screen-coordinate-top">CAM.01 / RGB</span>
            <span className="screen-coordinate screen-coordinate-bottom">SUBJECT: M.LEE</span>
          </div>
          <figcaption>
            <span>FIG.01</span>
            <span>PROFILE SAMPLE</span>
            <span>2026</span>
          </figcaption>
        </figure>
        <SignalPlot />
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="portfolio-section about-section relative flex-none">
      <div className="section-index" aria-hidden="true">
        02 / ABOUT
      </div>

      <div className="about-portrait-column">
        <div className="about-image-frame">
          <img src={profile.aboutPortrait} alt="Matthew Lee standing outdoors" draggable="false" />
          <span>OPTICAL INPUT / 02</span>
        </div>
        <div className="interest-bus">
          <span className="bus-label">ACTIVE NODES</span>
          {profile.interests.map((interest, index) => (
            <div className="interest-node" key={interest}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{interest}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-copy-column">
        <p className="signal-kicker">SYSTEM PROFILE</p>
        <h2>Built between hardware and code.</h2>
        <div className="about-prose">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="research-output">
          <span>OUTPUT</span>
          <strong>140+</strong>
          <p>students reached through hands-on microcontroller and FPGA workshops</p>
        </div>
      </div>

      <div className="skills-column">
        <div className="skills-header">
          <span>TECHNICAL MATRIX</span>
          <span>REV.04</span>
        </div>
        {profile.skills.map((skillGroup, groupIndex) => (
          <div className="skill-group" key={skillGroup.group}>
            <div className="skill-group-title">
              <span>0{groupIndex + 1}</span>
              <h3>{skillGroup.group}</h3>
            </div>
            <div className="skill-grid">
              {skillGroup.items.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectsSection() {
  return (
    <section id="projects" className="portfolio-section projects-section relative flex-none">
      <div className="project-intro">
        <div className="section-index" aria-hidden="true">
          03 / PROJECTS
        </div>
        <p className="signal-kicker">SELECTED OUTPUTS</p>
        <h2>Systems in motion.</h2>
        <p>Six builds across digital logic, embedded sensing, robotics, games, and the web.</p>
        <div className="project-scale" aria-hidden="true">
          <span>0.0</span>
          <span>1.0</span>
          <span>2.0</span>
          <span>3.0</span>
        </div>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="project-module" key={project.id}>
            <div className="project-module-head">
              <span>CH.{String(index + 1).padStart(2, '0')}</span>
              <span>{project.category}</span>
            </div>
            <ProjectMedia project={project} eager={index < 2} />
            <div className="project-content">
              <div className="project-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="technology-list" aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              {project.links.length > 0 ? (
                project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                    <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                ))
              ) : (
                <span>Research / hardware build</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const linkIcons = {
  GitHub: GitBranch,
  LinkedIn: Contact,
  Devpost: Box,
  Email: Mail,
}

export function LinksSection() {
  return (
    <section id="links" className="portfolio-section links-section relative flex-none">
      <div className="section-index" aria-hidden="true">
        04 / LINKS
      </div>
      <div className="links-copy">
        <p className="signal-kicker">OPEN CONNECTIONS</p>
        <h2>Let&apos;s build something that works.</h2>
        <p>Waterloo, Ontario / available across hardware, embedded, and software systems.</p>
      </div>

      <div className="terminal-bank">
        {contactLinks.map((link, index) => {
          const Icon = linkIcons[link.label]
          return (
            <a
              className="terminal-link"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
              key={link.label}
            >
              <span className="terminal-number">OUT.0{index + 1}</span>
              <Icon size={24} strokeWidth={1.35} aria-hidden="true" />
              <span className="terminal-copy">
                <strong>{link.label}</strong>
                <small>{link.value}</small>
              </span>
              <ArrowRight className="terminal-arrow" size={20} strokeWidth={1.4} aria-hidden="true" />
            </a>
          )
        })}
      </div>

      <div className="end-cap" aria-hidden="true">
        <div className="end-cap-node" />
        <span>END OF SIGNAL</span>
        <span>X.MAX / 2026</span>
      </div>
      <p className="copyright">© 2026 Matthew Lee</p>
    </section>
  )
}