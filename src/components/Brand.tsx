export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <path d="M16 7h8v9h9v8h-9v9h-8v-9H7v-8h9z" fill="currentColor" />
          <circle cx="32" cy="8" r="4" fill="#b6ddba" />
        </svg>
      </span>
      <span>
        RetDem<span className="brand-teal">SetGo!</span>
        <small>SMALL STEPS. STRONG FOUNDATIONS.</small>
      </span>
    </span>
  );
}
