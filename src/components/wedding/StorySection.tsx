import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import Ornament from "./Ornament";
import casal1 from "@/assets/casal-1.jpeg";
import casal2 from "@/assets/casal-2.jpeg";
import casal3 from "@/assets/casal-3.jpeg";
import casal4 from "@/assets/casal-4.jpeg";

const PHOTOS = [casal1, casal4, casal3, casal2];

const StorySection = () => {
  const [index, setIndex] = useState(0);
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const total = PHOTOS.length;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  /** Posição relativa de cada foto: 0 = centro, -1 = esquerda, 1 = direita. */
  const offsetOf = (i: number) => {
    const raw = (i - index + total) % total;
    return raw > total / 2 ? raw - total : raw;
  };

  return (
    <section
      id="historia"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20"
      style={{ background: "hsl(var(--wedding-bg))", color: "hsl(var(--wedding-ink))" }}
    >
      <Ornament
        className="pointer-events-none absolute bottom-8 left-0 h-56 w-44 lg:h-72 lg:w-56"
        opacity={0.4}
      />
      <Ornament
        className="pointer-events-none absolute bottom-8 right-0 h-56 w-44 lg:h-72 lg:w-56"
        opacity={0.4}
        flip
      />

      <div
        ref={ref}
        className={`relative z-10 w-full max-w-6xl ${revealed ? "animate-fade-up" : "opacity-0"}`}
      >
        <div className="text-center">
          <h2
            className="font-script text-6xl lg:text-8xl"
            style={{ color: "hsl(var(--wedding-gold))" }}
          >
            Nossa história
          </h2>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="h-px w-16 lg:w-24" style={{ background: "hsl(var(--wedding-gold) / 0.5)" }} />
            <Heart className="h-3.5 w-3.5" style={{ color: "hsl(var(--wedding-rose))" }} />
            <span className="h-px w-16 lg:w-24" style={{ background: "hsl(var(--wedding-gold) / 0.5)" }} />
          </div>
        </div>

        {/* Palco do carrossel */}
        <div className="relative mt-12 flex items-center justify-center" style={{ perspective: "1200px" }}>
          <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[620px]">
            {PHOTOS.map((src, i) => {
              const offset = offsetOf(i);
              const visible = Math.abs(offset) <= 1;
              const isCenter = offset === 0;

              return (
                <div
                  key={src}
                  aria-hidden={!isCenter}
                  className="absolute left-1/2 top-1/2 transition-all duration-700 ease-out"
                  style={{
                    width: "min(70vw, 400px)",
                    transform: `translate(-50%, -50%) translateX(${offset * 82}%) rotate(${offset * 7}deg) scale(${
                      isCenter ? 1 : 0.82
                    })`,
                    opacity: visible ? (isCenter ? 1 : 0.55) : 0,
                    zIndex: isCenter ? 20 : 10,
                    pointerEvents: visible ? "auto" : "none",
                  }}
                >
                  <div
                    className="overflow-hidden rounded-lg bg-white p-2.5 shadow-2xl lg:p-3"
                    style={{ boxShadow: "0 18px 45px hsl(var(--wedding-ink) / 0.28)" }}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-sm">
                      <img
                        src={src}
                        alt={`Arthur e Nicoly — foto ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Setas */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110 lg:h-14 lg:w-14"
              style={{ background: "hsl(var(--wedding-gold) / 0.85)", color: "white" }}
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110 lg:h-14 lg:w-14"
              style={{ background: "hsl(var(--wedding-gold) / 0.85)", color: "white" }}
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {PHOTOS.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir para a foto ${i + 1}`}
              aria-current={i === index}
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                background:
                  i === index ? "hsl(var(--wedding-rose))" : "hsl(var(--wedding-gold) / 0.45)",
                transform: i === index ? "scale(1.35)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySection;
