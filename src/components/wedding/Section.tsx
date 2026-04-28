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
    className={`relative min-h-screen w-full flex items-center justify-center px-6 py-20 snap-start overflow-hidden ${className}`}
    style={{ background: "hsl(var(--wedding-bg))", color: "hsl(var(--wedding-ink))" }}
  >
    {!noFrame && (
      <img
        src={floralFrame}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover sm:object-contain object-center mix-blend-multiply"
        style={{ opacity: 0.3 }}
        loading="lazy"
      />
    )}
    <div className="relative w-full max-w-2xl mx-auto animate-fade-up">{children}</div>
  </section>
);

export default Section;