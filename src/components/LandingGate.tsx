import { SignalWave } from './SignalWave'

type LandingGateProps = {
  phase: 'idle' | 'entering'
  onEnter: () => void
}

export function LandingGate({ phase, onEnter }: LandingGateProps) {
  return (
    <div className={`landing-gate ${phase === 'entering' ? 'is-entering' : ''}`}>
      <div className="landing-meta landing-meta-top" aria-hidden="true">
        <span>SYS.00</span>
        <span>48.000 kHz</span>
        <span className="landing-status">{phase === 'entering' ? 'START' : 'READY'}</span>
      </div>

      <SignalWave className="landing-wave" />

      <div className="landing-center">
        <span className="landing-coordinate" aria-hidden="true">
          X:0800 / Y:0450
        </span>
        <button type="button" className="hello-command" onClick={onEnter} disabled={phase !== 'idle'}>
          <span className="hello-label">
            welcome!<span aria-hidden="true"></span>
          </span>
          <span className="landing-origin" aria-hidden="true" />
        </button>
        <span className="landing-instruction">CLICK TO INITIALIZE</span>
      </div>

      <div className="landing-meta landing-meta-bottom" aria-hidden="true">
        <span>MATTHEW LEE / PORTFOLIO</span>
        <span>
          SCROLL SIGNAL:{' '}
          <span className="landing-signal-value">
            <span className="landing-signal-target">
              {phase === 'entering' ? '1.000' : '0.000'}
            </span>
            {phase === 'entering' &&
              ['0.000', '0.125', '0.330', '0.578', '0.780', '0.910', '0.975'].map((value) => (
                <span className="landing-signal-step" key={value}>
                  {value}
                </span>
              ))}
          </span>
        </span>
      </div>
    </div>
  )
}