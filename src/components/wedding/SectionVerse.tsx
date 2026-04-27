import { Flower2 } from "lucide-react";

const SectionVerse = () => {
  return (
    <section
      id="verse"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-romantic relative overflow-hidden"
    >
      <Flower2 className="absolute -top-6 -left-6 h-40 w-40 text-rose/30 animate-float-slow" />
      <Flower2 className="absolute -bottom-8 -right-8 h-48 w-48 text-rose/20 animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="max-w-xl mx-auto text-center space-y-10 relative z-10">
        <p className="font-script text-5xl md:text-6xl text-rose-deep leading-tight">
          Nicoly &amp; Arthur
        </p>

        <div className="h-px w-24 bg-rose-deep/40 mx-auto" />

        <blockquote className="font-display text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
          “Em breve, um versículo escolhido com carinho aparecerá aqui.”
        </blockquote>
        <p className="text-sm text-muted-foreground tracking-wider uppercase">— Versículo a definir</p>

        {/* Galeria de fotos placeholder */}
        <div className="grid grid-cols-3 gap-3 pt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-card shadow-soft flex items-center justify-center text-muted-foreground text-xs border border-border"
            >
              Foto {i}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">As fotos serão adicionadas em breve.</p>
      </div>
    </section>
  );
};

export default SectionVerse;