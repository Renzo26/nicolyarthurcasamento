import { ReactNode } from "react";
import floralFrame from "@/assets/floral-frame.png";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Esconde a moldura floral nesta seção */
  noFrame?: boolean;
}

const Section = ({ id, children, className = "", noFrame = false }: SectionProps) => (
  <section
    id={id}
    className={`relative min-h-screen w-full flex items-center justify-center px-6 py-16 sm:py-20 snap-start overflow-hidden ${className}`}
    style={{ background: "hsl(var(--wedding-bg))", color: "hsl(var(--wedding-ink))" }}
  >
    {!noFrame && (
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
      >
        <img
          src={floralFrame}
          alt=""
          className="h-full w-auto max-w-none sm:w-full sm:h-full sm:object-cover mix-blend-multiply opacity-25 sm:opacity-30"
          loading="lazy"
        />
      </div>
    )}
    <div className="relative z-10 w-full max-w-2xl mx-auto animate-fade-up">
      {children}
    </div>
  </section>
);

export default Section;