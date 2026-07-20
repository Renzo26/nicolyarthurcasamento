const GOLD = "hsl(var(--wedding-gold))";

interface FlourishProps {
  className?: string;
  /**
   * line   — filete · coração · filete
   * scroll — voluta simétrica com losango central
   * ornate — voluta com miolo luminoso, para quebrar a moldura
   */
  variant?: "line" | "scroll" | "ornate";
  opacity?: number;
}

const Flourish = ({ className = "", variant = "line", opacity = 1 }: FlourishProps) => {
  if (variant === "line") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`} style={{ opacity }}>
        <span className="h-px w-12 lg:w-16" style={{ background: "hsl(var(--wedding-gold) / 0.5)" }} />
        <svg viewBox="0 0 24 22" className="h-2.5 w-2.5" fill={GOLD} aria-hidden="true">
          <path d="M12 21 C 2 13 0 8 0 5.5 A 5.5 5.5 0 0 1 12 3 A 5.5 5.5 0 0 1 24 5.5 C 24 8 22 13 12 21 Z" />
        </svg>
        <span className="h-px w-12 lg:w-16" style={{ background: "hsl(var(--wedding-gold) / 0.5)" }} />
      </div>
    );
  }

  return (
    <svg
      viewBox="-100 -18 200 36"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <g stroke={GOLD} strokeWidth="1" strokeLinecap="round">
        <path d="M-13 0 C -33 -9 -55 -9 -70 -1 C -79 4 -88 2 -91 -4" />
        <path d="M13 0 C 33 -9 55 -9 70 -1 C 79 4 88 2 91 -4" />
        <path d="M-20 4 C -35 9 -50 9 -62 6" strokeWidth="0.65" opacity="0.6" />
        <path d="M20 4 C 35 9 50 9 62 6" strokeWidth="0.65" opacity="0.6" />
        <circle cx="-91" cy="-6" r="1.7" fill={GOLD} stroke="none" />
        <circle cx="91" cy="-6" r="1.7" fill={GOLD} stroke="none" />
      </g>
      {variant === "ornate" ? (
        <circle
          cx="0"
          cy="0"
          r="3.4"
          fill="hsl(42 70% 82%)"
          style={{ filter: "drop-shadow(0 0 6px hsl(42 70% 70%))" }}
        />
      ) : (
        <rect x="-3.4" y="-3.4" width="6.8" height="6.8" transform="rotate(45)" fill={GOLD} />
      )}
    </svg>
  );
};

export default Flourish;
