export default function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 410 330" fill="none">
        <defs>
          <linearGradient
            id="paper"
            x1="154"
            y1="51"
            x2="300"
            y2="300"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#f5faf6" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="220%">
            <feDropShadow
              dx="0"
              dy="13"
              stdDeviation="13"
              floodColor="#28584f"
              floodOpacity=".13"
            />
          </filter>
          <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.1" fill="#bdd8ca" />
          </pattern>
        </defs>
        <circle cx="218" cy="163" r="133" fill="#d7ebdf" />
        <circle cx="218" cy="163" r="156" stroke="#bedbcd" strokeDasharray="3 8" />
        <path d="M57 209h69v77H57zM281 17h87v83h-87z" fill="url(#dots)" />
        <g transform="rotate(10 218 170)" filter="url(#shadow)">
          <rect x="126" y="47" width="184" height="247" rx="18" fill="#235653" />
          <rect x="135" y="57" width="166" height="225" rx="11" fill="url(#paper)" />
          <rect x="178" y="39" width="80" height="30" rx="9" fill="#97beb0" />
          <rect x="199" y="34" width="37" height="14" rx="7" fill="#4b8072" />
          <rect x="155" y="88" width="43" height="43" rx="12" fill="#e3f0e8" />
          <path d="M173 96h8v10h10v8h-10v10h-8v-10h-10v-8h10z" fill="#397e6e" />
          <rect x="210" y="95" width="63" height="6" rx="3" fill="#315d58" />
          <rect x="210" y="110" width="47" height="4" rx="2" fill="#a2beb2" />
          {[154, 191, 228].map((y, i) => (
            <g key={y}>
              <rect
                x="156"
                y={y}
                width="19"
                height="19"
                rx="5"
                fill={i === 2 ? '#edf2eb' : '#d6eadd'}
              />
              {i < 2 && (
                <path
                  d={`M161 ${y + 9}l3 3 6-7`}
                  stroke="#397e6e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              <rect x="187" y={y + 2} width={80 - i * 9} height="5" rx="2.5" fill="#85a99a" />
              <rect x="187" y={y + 13} width={61 + i * 5} height="4" rx="2" fill="#d4e0d7" />
            </g>
          ))}
        </g>
        <g filter="url(#shadow)">
          <rect x="52" y="83" width="70" height="70" rx="21" fill="#fff" />
          <path
            d="M67 118h10l6-14 9 26 6-12h9"
            stroke="#4c8b77"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g filter="url(#shadow)">
          <rect x="284" y="209" width="69" height="69" rx="22" fill="#fff" />
          <circle cx="318" cy="243" r="19" fill="#e2f1e5" />
          <path
            d="M309 242l7 7 12-14"
            stroke="#3e856d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <circle cx="337" cy="120" r="7" fill="#eac4a2" />
        <circle cx="102" cy="255" r="5" fill="#85b49a" />
        <path
          d="M79 183v12m-6-6h12M334 175v10m-5-5h10"
          stroke="#77a48c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="art-caption">
        <span className="live-dot" /> A little practice. A lot more confidence.
      </span>
    </div>
  );
}
