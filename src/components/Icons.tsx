type IconProps = { className?: string };

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" {...base}>
      <path d="M2 8h12M9.5 3.5L14 8l-4.5 4.5" />
    </svg>
  );
}

/* --- サービスアイコン ------------------------------------------------ */

function Catalog({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <rect x="6" y="10" width="16" height="12" rx="2" />
      <rect x="26" y="10" width="16" height="12" rx="2" />
      <rect x="6" y="26" width="16" height="12" rx="2" />
      <rect x="26" y="26" width="16" height="12" rx="2" />
      <path d="M30 32h8M30 35h5" opacity=".55" />
      <path d="M10 16h8M10 32h8" opacity=".55" />
    </svg>
  );
}

function App({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <rect x="7" y="6" width="34" height="36" rx="4" />
      <path d="M7 14h34" />
      <circle cx="12" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <path d="M17 24l-4 4 4 4M31 24l4 4-4 4M27 21l-6 14" />
    </svg>
  );
}

function Web({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34" />
      <path d="M24 7c4.5 4.6 7 10.6 7 17s-2.5 12.4-7 17c-4.5-4.6-7-10.6-7-17S19.5 11.6 24 7z" />
      <path d="M11 14c3.8 2.4 8.3 3.7 13 3.7S33.2 16.4 37 14M11 34c3.8-2.4 8.3-3.7 13-3.7s9.2 1.3 13 3.7" opacity=".55" />
    </svg>
  );
}

function Cloud({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <path d="M14 33a7.5 7.5 0 010-15 10.5 10.5 0 0120.2-2.4A8 8 0 0134 33z" />
      <path d="M24 25v13M24 25l-4.5 4.5M24 25l4.5 4.5" />
    </svg>
  );
}

function Data({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <path d="M8 40V26M18 40V16M28 40V22M38 40V10" />
      <path d="M6 40h36" opacity=".55" />
      <path d="M8 22l10-10 10 6 10-10" opacity=".45" strokeDasharray="3 3" />
    </svg>
  );
}

function Ai({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" {...base}>
      <rect x="14" y="14" width="20" height="20" rx="5" />
      <circle cx="24" cy="24" r="4.5" />
      <path d="M24 6v8M24 34v8M6 24h8M34 24h8M11.5 11.5l5.5 5.5M31 31l5.5 5.5M36.5 11.5L31 17M17 31l-5.5 5.5" />
    </svg>
  );
}

const map: Record<string, (p: IconProps) => JSX.Element> = {
  catalog: Catalog,
  app: App,
  web: Web,
  cloud: Cloud,
  data: Data,
  ai: Ai,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Component = map[name] ?? Ai;
  return <Component className={className} />;
}
