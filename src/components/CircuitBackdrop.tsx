export function CircuitBackdrop() {
  return (
    <div className="circuit-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
        <path className="circuit-wire circuit-wire-a" d="M0 170 H130 V245 H285 V128 H430" />
        <path className="circuit-wire circuit-wire-b" d="M1155 80 V188 H1280 V310 H1600" />
        <path className="circuit-wire circuit-wire-c" d="M0 710 H190 V650 H320 V790 H510" />
        <path className="circuit-wire circuit-wire-d" d="M1120 760 H1260 V655 H1410 V750 H1600" />
        <g className="circuit-nodes">
          <circle cx="130" cy="170" r="5" />
          <circle cx="285" cy="245" r="5" />
          <circle cx="1280" cy="188" r="5" />
          <circle cx="190" cy="710" r="5" />
          <circle cx="1410" cy="655" r="5" />
        </g>
      </svg>
      <div className="signal-progress">
        <span>SCROLL / X</span>
        <div className="signal-progress-track">
          <span />
        </div>
        <span className="velocity-readout">V</span>
      </div>
    </div>
  )
}