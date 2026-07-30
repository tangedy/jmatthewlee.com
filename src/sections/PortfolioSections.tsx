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
          d="M0 146 H36 V140 H62 V128 H88 V108 H110 V106 H132 V132 H150 V126 H174 V80 H196 V92 H222 V146 H244 V134 H268 V49 H294 V66 H320 V150 H346 V136 H372 V91 H398 V103 H424 V131 H450 V122 H474 V115 H496 V120 H522 V124 H550 V119 H580 V118 H612 V121 H650 V119 H690 V121 H730 V119 H760"
        />
        <path
          className="plot-trace plot-trace-green"
          d="M0 160 H70 V158 H104 V153 H140 V149 H206 V144 H250 V140 H316 V135 H366 V133 H430 V130 H488 V128 H570 V126 H640 V125 H710 V124 H760"
        />
        <path
          className="plot-trace plot-trace-magenta"
          d="M0 174 H110 V172 H166 V166 H226 V160 H330 V151 H420 V147 H560 V142 H660 V141 H760 V140"
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
        <p className="signal-kicker">
          <span className="home-text-backplate">MTRX // WATERLOO</span>
        </p>
        <h1 aria-label="Matthew Lee">
          <span className="home-text-backplate">Matthew</span>
          <span className="home-text-backplate">Lee</span>
        </h1>
        <p className="home-bio">
          <span className="home-text-backplate">{profile.shortBio}</span>
        </p>
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
        <h2>About myself</h2>
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
        <h2>My works</h2>
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
        <h2>PLEASE HIRE ME PLEASE PLEASE</h2>
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