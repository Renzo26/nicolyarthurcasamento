import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * narrow — texto corrido, mantém a medida legível
 * wide   — composições que ocupam a largura do desktop
 */
type SectionWidth = "narrow" | "wide";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  width?: SectionWidth;
  /** night = fundo escuro com texto creme; light = papel claro com texto escuro. */
  tone?: "night" | "light";
  /** Foto de fundo sangrando na tela. */
  bgImage?: string;
  /** Desfoque da foto de fundo, em px — dissolve a cena em atmosfera. */
  bgBlur?: number;
  /** Quanto escurecer a foto (0 a 1). */
  overlay?: number;
  bgPosition?: string;
  /** Molduras e ornamentos ancorados à seção inteira, não ao container do conteúdo. */
  decor?: ReactNode;
}

const widthClass: Record<SectionWidth, string> = {
  narrow: "max-w-2xl",
  wide: "max-w-2xl lg:max-w-6xl xl:max-w-7xl",
};

const Section = ({
  id,
  children,
  className = "",
  width = "narrow",
  tone = "night",
  bgImage,
  bgBlur = 0,
  overlay = 0.8,
  bgPosition = "center",
  decor,
}: SectionProps) => {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const night = tone === "night";

  return (
    <section
      id={id}
      className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 lg:px-12 py-20 ${className}`}
      style={{
        background: night ? "hsl(var(--wedding-night))" : "hsl(var(--wedding-bg))",
        color: night ? "hsl(var(--wedding-cream))" : "hsl(var(--wedding-ink))",
      }}
    >
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: bgPosition,
              filter: bgBlur ? `blur(${bgBlur}px)` : undefined,
              // Compensa as bordas transparentes que o blur cria
              transform: bgBlur ? `scale(${1 + bgBlur / 90})` : undefined,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: night
                ? `hsl(var(--wedding-night) / ${overlay})`
                : `hsl(var(--wedding-bg) / ${overlay})`,
            }}
          />
        </>
      )}

      {decor}

      <div
        ref={ref}
        className={`relative z-10 w-full mx-auto ${widthClass[width]} ${
          revealed ? "animate-fade-up" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
