import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, children, className = "" }: SectionProps) => (
  <section
    id={id}
    className={`relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-20 snap-start ${className}`}
    style={{ background: "transparent", color: "hsl(var(--wedding-ink))" }}
  >
    <div className="w-full max-w-2xl mx-auto animate-fade-up">{children}</div>
  </section>
);

export default Section;