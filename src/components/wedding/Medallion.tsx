const GOLD = "hsl(var(--wedding-gold))";

interface MedallionProps {
  className?: string;
  /** heart — coração vazado | sprig — raminho florido */
  motif?: "heart" | "sprig";
  /** Coração cheio apoiado no topo do círculo. */
  topHeart?: boolean;
}

/** Medalhão circular dourado com brilho suave, usado como vinheta de seção. */
const Medallion = ({ className = "", motif = "heart", topHeart = false }: MedallionProps) => (
  <svg
    viewBox="-50 -60 100 110"
    className={className}
    fill="none"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 0 14px hsl(40 60% 55% / 0.45))" }}
  >
    <circle cx="0" cy="0" r="38" stroke={GOLD} strokeWidth="1.2" />

    {topHeart && (
      <path
        d="M0 -32 C -8 -39 -10 -43 -10 -45.5 A 4.6 4.6 0 0 1 0 -48 A 4.6 4.6 0 0 1 10 -45.5 C 10 -43 8 -39 0 -32 Z"
        fill={GOLD}
      />
    )}

    {motif === "heart" ? (
      <path
        d="M0 16 C -16 3 -20 -5 -20 -9.5 A 9.5 9.5 0 0 1 0 -14 A 9.5 9.5 0 0 1 20 -9.5 C 20 -5 16 3 0 16 Z"
        stroke={GOLD}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ) : (
      <g stroke={GOLD} strokeWidth="1" strokeLinecap="round">
        {/* Caule central */}
        <path d="M0 20 C -1 6 0 -6 0 -18" />
        {/* Folhas alternadas */}
        {[
          { y: 12, dir: 1 },
          { y: 4, dir: -1 },
          { y: -4, dir: 1 },
        ].map(({ y, dir }) => (
          <path
            key={y}
            d={`M0 ${y} C ${dir * 6} ${y - 3} ${dir * 11} ${y - 7} ${dir * 12} ${y - 12}
                C ${dir * 6} ${y - 11} ${dir * 2} ${y - 6} 0 ${y} Z`}
          />
        ))}
        {/* Botões floridos nas pontas */}
        {[
          { x: -13, y: -12 },
          { x: 13, y: -14 },
          { x: 0, y: -20 },
        ].map(({ x, y }) => (
          <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-2.8" rx="1.7" ry="3" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="0.9" fill={GOLD} stroke="none" />
          </g>
        ))}
        <path d="M0 -18 C -5 -18 -10 -16 -13 -12" strokeWidth="0.8" />
        <path d="M0 -18 C 5 -18 10 -16 13 -14" strokeWidth="0.8" />
      </g>
    )}
  </svg>
);

export default Medallion;
