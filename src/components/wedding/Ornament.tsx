interface OrnamentProps {
  className?: string;
  /** Espelha horizontalmente — para usar o mesmo ramo nos dois cantos. */
  flip?: boolean;
  variant?: "sprig" | "bloom";
  opacity?: number;
}

const LEAF = "M0 0 C 7 -9 22 -11 30 -3 C 22 5 7 5 0 0 Z";
const LEAF_VEIN = "M2 0 C 11 -3 21 -4 29 -3";

/** Folhas distribuídas ao longo do caule, alternando os lados. */
const LEAVES = [
  { y: 236, side: 1, rot: -22, s: 1.0 },
  { y: 222, side: -1, rot: -24, s: 0.92 },
  { y: 203, side: 1, rot: -26, s: 1.05 },
  { y: 188, side: -1, rot: -28, s: 0.88 },
  { y: 168, side: 1, rot: -30, s: 1.0 },
  { y: 152, side: -1, rot: -30, s: 0.85 },
  { y: 132, side: 1, rot: -34, s: 0.92 },
  { y: 116, side: -1, rot: -34, s: 0.78 },
  { y: 96, side: 1, rot: -38, s: 0.8 },
  { y: 80, side: -1, rot: -38, s: 0.68 },
  { y: 60, side: 1, rot: -42, s: 0.66 },
];

/** Pétalas da florzinha do pé do ramo. */
const PETALS = [0, 72, 144, 216, 288];

const Ornament = ({ className = "", flip = false, variant = "sprig", opacity = 0.5 }: OrnamentProps) => (
  <svg
    viewBox="0 0 200 260"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{
      transform: flip ? "scaleX(-1)" : undefined,
      opacity,
      color: "hsl(var(--wedding-gold))",
    }}
  >
    <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none">
      {/* Caule principal */}
      <path d="M100 256 C 94 206 92 158 98 112 C 103 72 112 40 122 12" />
      {/* Caule secundário, mais curto */}
      <path d="M100 256 C 112 216 126 186 142 164" strokeWidth="0.9" />

      {LEAVES.map((leaf, i) => {
        // Acompanha a curva do caule conforme sobe
        const x = 100 + (256 - leaf.y) * 0.085;
        return (
          <g
            key={i}
            transform={`translate(${x} ${leaf.y}) scale(${leaf.side * leaf.s} ${leaf.s}) rotate(${leaf.rot})`}
          >
            <path d={LEAF} />
            <path d={LEAF_VEIN} strokeWidth="0.7" opacity="0.7" />
          </g>
        );
      })}

      {/* Folhas do ramo secundário */}
      {[
        { x: 118, y: 224, rot: 18 },
        { x: 132, y: 200, rot: 8 },
        { x: 142, y: 176, rot: -4 },
      ].map((l, i) => (
        <g key={`b${i}`} transform={`translate(${l.x} ${l.y}) scale(0.7) rotate(${l.rot})`}>
          <path d={LEAF} />
        </g>
      ))}

      {variant === "bloom" && (
        <g transform="translate(122 12)">
          {PETALS.map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-9"
              rx="5"
              ry="9.5"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="2.6" />
        </g>
      )}

      {/* Frutinhos delicados */}
      <circle cx="86" cy="196" r="2.2" />
      <circle cx="80" cy="182" r="1.7" />
      <circle cx="90" cy="170" r="1.4" />
    </g>
  </svg>
);

export default Ornament;
