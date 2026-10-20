export function GrowthSystemDiagram() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none">
      <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] max-h-[380px] flex items-center justify-center">
        {/* Glow behind center Strategy node */}
        <div
          className="absolute w-44 h-44 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(25, 242, 140, 0.5) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <svg
          className="w-full h-full max-w-[620px]"
          viewBox="0 0 600 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#19F28C" />
              <stop offset="50%" stopColor="#3DD6F5" />
              <stop offset="100%" stopColor="#7B61FF" />
            </linearGradient>

            <style>{`
              @keyframes dash-flow {
                to {
                  stroke-dashoffset: -40;
                }
              }
              .animated-flow-line {
                stroke-dasharray: 6 6;
                animation: dash-flow 2.5s linear infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .animated-flow-line {
                  animation: none;
                }
              }
            `}</style>
          </defs>

          {/* Outer Orbital Loop connecting Website -> CRM -> Marketing -> Website */}
          <ellipse
            cx="300"
            cy="180"
            rx="210"
            ry="110"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Animated Dashed Loop */}
          <ellipse
            cx="300"
            cy="180"
            rx="210"
            ry="110"
            stroke="url(#flow-grad)"
            strokeWidth="2"
            fill="none"
            className="animated-flow-line"
            opacity="0.85"
          />

          {/* Radial Spokes from Strategy to the 3 Nodes */}
          {/* To Top (Website) */}
          <line
            x1="300"
            y1="180"
            x2="300"
            y2="70"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* To Bottom Left (CRM) */}
          <line
            x1="300"
            y1="180"
            x2="118"
            y2="235"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* To Bottom Right (Marketing) */}
          <line
            x1="300"
            y1="180"
            x2="482"
            y2="235"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* ================= CENTER NODE: STRATEGY ================= */}
          <g transform="translate(300, 180)">
            <circle r="46" fill="#10131C" stroke="#19F28C" strokeWidth="2" />
            <circle r="52" fill="none" stroke="rgba(25, 242, 140, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
            <text
              y="-6"
              textAnchor="middle"
              fill="#19F28C"
              fontSize="9"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.15em"
              fontWeight="600"
            >
              CORE
            </text>
            <text
              y="14"
              textAnchor="middle"
              fill="#F5F7FA"
              fontSize="14"
              fontFamily="var(--font-space-grotesk)"
              fontWeight="600"
            >
              Strategy
            </text>
          </g>

          {/* ================= NODE 1: WEBSITE (Top Center) ================= */}
          <g transform="translate(300, 70)">
            <rect x="-65" y="-24" width="130" height="48" rx="24" fill="#10131C" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" />
            <circle cx="-42" cy="0" r="4" fill="#3DD6F5" />
            <text
              x="2"
              y="-3"
              textAnchor="middle"
              fill="#F5F7FA"
              fontSize="13"
              fontFamily="var(--font-space-grotesk)"
              fontWeight="600"
            >
              Website
            </text>
            <text
              x="2"
              y="12"
              textAnchor="middle"
              fill="#A3A9B8"
              fontSize="8.5"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.1em"
            >
              CONVERSION
            </text>
          </g>

          {/* ================= NODE 2: CRM (Bottom Left) ================= */}
          <g transform="translate(118, 235)">
            <rect x="-60" y="-24" width="120" height="48" rx="24" fill="#10131C" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" />
            <circle cx="-38" cy="0" r="4" fill="#7B61FF" />
            <text
              x="2"
              y="-3"
              textAnchor="middle"
              fill="#F5F7FA"
              fontSize="13"
              fontFamily="var(--font-space-grotesk)"
              fontWeight="600"
            >
              CRM
            </text>
            <text
              x="2"
              y="12"
              textAnchor="middle"
              fill="#A3A9B8"
              fontSize="8.5"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.1em"
            >
              RETENTION
            </text>
          </g>

          {/* ================= NODE 3: MARKETING (Bottom Right) ================= */}
          <g transform="translate(482, 235)">
            <rect x="-68" y="-24" width="136" height="48" rx="24" fill="#10131C" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" />
            <circle cx="-46" cy="0" r="4" fill="#19F28C" />
            <text
              x="2"
              y="-3"
              textAnchor="middle"
              fill="#F5F7FA"
              fontSize="13"
              fontFamily="var(--font-space-grotesk)"
              fontWeight="600"
            >
              Marketing
            </text>
            <text
              x="2"
              y="12"
              textAnchor="middle"
              fill="#A3A9B8"
              fontSize="8.5"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.1em"
            >
              ACQUISITION
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 px-4 py-1.5 rounded-full glass border border-white/10 text-xs font-mono text-green flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green" />
        <span>Every service feeds the next.</span>
      </div>
    </div>
  );
}
