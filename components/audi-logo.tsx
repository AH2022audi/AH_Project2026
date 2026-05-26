/**
 * AudiLogo — Official Audi four-rings mark.
 * Coordinates extracted directly from the live saic-audi.cn SVG:
 *   viewBox="0 0 512 180", r=80, cx = 90 / 200 / 310 / 420
 * stroke-width set to 8 (≈ r/10) matching the official visual weight.
 * Uses currentColor so it adapts to any text colour context.
 */
export function AudiLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 180"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      aria-label="Audi"
      role="img"
    >
      <circle cx="90"  cy="90" r="80" />
      <circle cx="200" cy="90" r="80" />
      <circle cx="310" cy="90" r="80" />
      <circle cx="420" cy="90" r="80" />
    </svg>
  )
}
