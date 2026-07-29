type SignalWaveProps = {
  className: string
}

const traces = [
  {
    className: 'intro-signal-cyan',
    path: 'M800 450 C842 450 858 438 892 438 S934 480 970 480 S1010 396 1052 396 S1096 526 1142 526 S1192 330 1246 330 S1306 590 1370 590 S1440 244 1512 244 S1590 690 1672 690 S1760 150 1850 150 S1948 770 2048 770 H2260',
    endpoint: [2260, 770],
  },
  {
    className: 'intro-signal-accent',
    path: 'M800 450 C862 450 880 466 918 466 H956 C976 466 984 414 1012 414 H1028 C1052 414 1050 492 1078 492 H1124 C1150 492 1158 358 1196 358 H1218 C1254 358 1250 558 1282 558 H1338 C1370 558 1378 274 1430 274 H1458 C1510 274 1500 636 1546 636 H1614 C1652 636 1664 194 1734 194 H1768 C1838 194 1808 730 1884 730 H1964 C2010 730 2034 122 2114 122 H2140',
    endpoint: [2140, 122],
  },
  {
    className: 'intro-signal-green',
    path: 'M800 450 C826 450 840 444 858 444 S884 462 902 462 S928 424 948 424 S976 486 998 486 S1028 392 1052 392 S1084 514 1110 514 S1146 352 1176 352 S1216 554 1250 554 S1296 304 1334 304 S1386 606 1430 606 S1488 250 1538 250 S1604 666 1660 666 S1734 186 1798 186 S1882 734 1954 734 S1992 500 2020 500',
    endpoint: [2020, 500],
  },
  {
    className: 'intro-signal-magenta',
    path: 'M800 450 C870 450 900 448 946 448 S1010 458 1060 458 S1128 426 1184 426 S1258 500 1322 500 S1408 360 1482 360 S1576 566 1660 566 S1764 286 1858 286 S1974 650 2078 650 S2150 214 2190 214',
    endpoint: [2190, 214],
  },
] as const

export function SignalWave({ className }: SignalWaveProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 3200 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="landing-axis" pathLength="1" d="M800 450 H2260" />
      {traces.map((trace) => (
        <g className={`intro-signal ${trace.className}`} key={trace.className}>
          <path pathLength="1" d={trace.path} />
          <circle className="signal-endpoint" cx={trace.endpoint[0]} cy={trace.endpoint[1]} r="5" />
        </g>
      ))}
    </svg>
  )
}