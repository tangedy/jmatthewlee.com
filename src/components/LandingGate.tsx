type LandingGateProps = {
  phase: 'idle' | 'entering'
  onEnter: () => void
}

const leftWave =
  'M800 450 C760 450 755 370 720 370 S675 525 635 525 S590 280 548 280 S500 490 455 490 S410 345 365 345 S320 565 275 565 S230 390 185 390 S135 465 90 465 S45 425 0 425'
const rightWave =
  'M800 450 C840 450 845 330 880 330 S925 515 965 515 S1010 300 1052 300 S1100 485 1145 485 S1190 360 1235 360 S1280 550 1325 550 S1370 385 1415 385 S1465 470 1510 470 S1555 425 1600 425'

export function LandingGate({ phase, onEnter }: LandingGateProps) {
  return (
    <div className={`landing-gate ${phase === 'entering' ? 'is-entering' : ''}`}>
      <div className="landing-meta landing-meta-top" aria-hidden="true">
        <span>SYS.00</span>
        <span>48.000 kHz</span>
        <span>READY</span>
      </div>

      <svg
        className="landing-wave"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="landing-axis" d="M0 450 H1600" />
        <g className="intro-signal intro-signal-cyan">
          <path pathLength="1" d={leftWave} />
          <path pathLength="1" d={rightWave} />
        </g>
        <g className="intro-signal intro-signal-blue">
          <path pathLength="1" d={leftWave} transform="translate(0 -44) scale(1 1.1)" />
          <path pathLength="1" d={rightWave} transform="translate(0 -44) scale(1 1.1)" />
        </g>
        <g className="intro-signal intro-signal-green">
          <path pathLength="1" d={leftWave} transform="translate(0 45) scale(1 .9)" />
          <path pathLength="1" d={rightWave} transform="translate(0 45) scale(1 .9)" />
        </g>
        <g className="intro-signal intro-signal-magenta">
          <path pathLength="1" d={leftWave} transform="translate(0 12) scale(1 .72)" />
          <path pathLength="1" d={rightWave} transform="translate(0 12) scale(1 .72)" />
        </g>
      </svg>

      <div className="landing-center">
        <span className="landing-coordinate" aria-hidden="true">
          X:0800 / Y:0450
        </span>
        <button type="button" className="hello-command" onClick={onEnter} disabled={phase !== 'idle'}>
          hello<span aria-hidden="true">.</span>
        </button>
        <span className="landing-instruction">CLICK TO INITIALIZE</span>
      </div>

      <div className="landing-meta landing-meta-bottom" aria-hidden="true">
        <span>MATTHEW LEE / PORTFOLIO</span>
        <span>SCROLL SIGNAL: 0.000</span>
      </div>
    </div>
  )
}