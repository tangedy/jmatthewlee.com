export function CircuitBackdrop() {
  return (
    <div className="circuit-backdrop" aria-hidden="true">
      <div className="circuit-field">
        <svg viewBox="0 0 2400 900" preserveAspectRatio="none">
          <defs>
            <pattern id="pcb-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0 H0 V48" className="pcb-grid-line" />
              <circle cx="1" cy="1" r="1.5" className="pcb-grid-dot" />
            </pattern>
          </defs>
          <rect width="2400" height="900" className="pcb-grid" />

          <g className="circuit-traces">
            <path className="circuit-wire circuit-wire-accent" d="M0 152 H180 V226 H350 V116 H525 V278 H720" />
            <path className="circuit-wire" d="M0 204 H132 V306 H268 V370 H470 V324 H650" />
            <path className="circuit-wire circuit-wire-thin" d="M82 0 V92 H255 V168 H410" />
            <path className="circuit-wire" d="M0 735 H210 V652 H385 V790 H570 V690 H760" />
            <path className="circuit-wire circuit-wire-accent" d="M480 900 V808 H690 V742 H870 V622 H1050" />
            <path className="circuit-wire" d="M690 0 V104 H845 V182 H1010 V292 H1175" />
            <path className="circuit-wire circuit-wire-accent" d="M925 900 V778 H1115 V690 H1285 V742 H1455 V615 H1625" />
            <path className="circuit-wire" d="M1110 0 V82 H1290 V206 H1445 V130 H1610" />
            <path className="circuit-wire circuit-wire-thin" d="M1170 410 H1320 V348 H1510 V420 H1695 V308 H1850" />
            <path className="circuit-wire circuit-wire-accent" d="M1470 900 V820 H1645 V730 H1825 V812 H2010 V690 H2220" />
            <path className="circuit-wire" d="M1600 0 V120 H1775 V232 H1940 V162 H2110 V286 H2400" />
            <path className="circuit-wire circuit-wire-thin" d="M1780 510 H1930 V440 H2095 V532 H2260 V460 H2400" />
            <path className="circuit-wire circuit-wire-accent" d="M1910 900 V790 H2075 V650 H2245 V716 H2400" />
          </g>

          <g className="circuit-chips">
            <rect x="720" y="252" width="220" height="270" rx="4" />
            <rect x="1645" y="248" width="190" height="220" rx="4" />
            <path d="M750 252 V228 M790 252 V228 M830 252 V228 M870 252 V228 M910 252 V228 M750 522 V546 M790 522 V546 M830 522 V546 M870 522 V546 M910 522 V546" />
            <path d="M1645 278 H1621 M1645 318 H1621 M1645 358 H1621 M1645 398 H1621 M1835 278 H1859 M1835 318 H1859 M1835 358 H1859 M1835 398 H1859" />
          </g>

          <g className="circuit-nodes">
            <circle cx="180" cy="152" r="6" />
            <circle cx="350" cy="226" r="6" />
            <circle cx="385" cy="652" r="6" />
            <circle cx="690" cy="742" r="6" />
            <circle cx="845" cy="104" r="6" />
            <circle cx="1115" cy="690" r="6" />
            <circle cx="1290" cy="82" r="6" />
            <circle cx="1510" cy="348" r="6" />
            <circle cx="1645" cy="730" r="6" />
            <circle cx="1775" cy="120" r="6" />
            <circle cx="2075" cy="790" r="6" />
            <circle cx="2260" cy="460" r="6" />
          </g>

          <g className="circuit-labels">
            <text x="748" y="390">U01 / MTRX</text>
            <text x="1672" y="365">DSP / 48K</text>
            <text x="192" y="142">VCC.3V3</text>
            <text x="2078" y="780">BUS.04</text>
          </g>
        </svg>
      </div>
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