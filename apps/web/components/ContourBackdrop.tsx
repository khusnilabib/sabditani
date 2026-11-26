export function ContourBackdrop({ animated = true }: { animated?: boolean }) {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 28 + i * 9;
    return `M -40 ${y} C 180 ${y - 26 + i * 3}, 380 ${y + 24 - i}, 620 ${y + 2} S 1040 ${y - 18 + i * 2}, 1320 ${y + 8}`;
  });
  return (
    <div className={`contour${animated ? ' is-animated' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1200 500" preserveAspectRatio="none">
        {lines.map((d, i) => <path key={i} d={d} opacity={0.35 + i * 0.04} />)}
      </svg>
    </div>
  );
}
