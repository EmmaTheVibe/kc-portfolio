type P = { className?: string };

export const TLClose = ({ className }: P) => (
  <svg viewBox="0 0 8 8" className={className} aria-hidden>
    <path d="M1.8 1.8l4.4 4.4M6.2 1.8L1.8 6.2" stroke="rgba(0,0,0,.55)" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const TLMin = ({ className }: P) => (
  <svg viewBox="0 0 8 8" className={className} aria-hidden>
    <path d="M1.5 4h5" stroke="rgba(0,0,0,.55)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const TLZoom = ({ className }: P) => (
  <svg viewBox="0 0 8 8" className={className} aria-hidden>
    <path d="M2 2h3L2 5ZM6 6H3l3-3Z" fill="rgba(0,0,0,.55)" />
  </svg>
);

export const BatteryGlyph = ({ className, level = 0.87 }: P & { level?: number }) => (
  <svg viewBox="0 0 26 13" className={className} aria-hidden>
    <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".45" />
    <rect x="2" y="2" width={19 * level} height="9" rx="2" fill="currentColor" />
    <path d="M24 4.5v4a2 2 0 0 0 0-4Z" fill="currentColor" fillOpacity=".45" />
  </svg>
);

export const SignalGlyph = ({ className }: P) => (
  <svg viewBox="0 0 18 12" className={className} aria-hidden>
    <g fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </g>
  </svg>
);

/** Wi-Fi strength fan used in the network list; `bars` is 1–3. */
export const WifiStrength = ({ className, bars = 3 }: P & { bars?: number }) => (
  <svg viewBox="0 0 16 12" className={className} aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" opacity={bars >= 3 ? 1 : 0.3} />
      <path d="M4 6.9a6 6 0 0 1 8 0" opacity={bars >= 2 ? 1 : 0.3} />
    </g>
    <circle cx="8" cy="10" r="1.4" fill="currentColor" />
  </svg>
);

/** Small spark mark used by the Assistant app. */
export const SparkMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 2c.6 4.8 2.4 6.6 7.2 7.2C14.4 9.8 12.6 11.6 12 16.4 11.4 11.6 9.6 9.8 4.8 9.2 9.6 8.6 11.4 6.8 12 2Z" fill="currentColor" />
    <path d="M18.5 14c.3 2.2 1 2.9 3.2 3.2-2.2.3-2.9 1-3.2 3.2-.3-2.2-1-2.9-3.2-3.2 2.2-.3 2.9-1 3.2-3.2Z" fill="currentColor" opacity=".6" />
  </svg>
);
