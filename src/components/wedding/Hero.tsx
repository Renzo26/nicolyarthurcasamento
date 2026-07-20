import { CSSProperties } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { useLenis } from "lenis/react";
import fundo from "@/assets/fundo.jpg";

interface HeroProps {
  /** Dispara a entrada encadeada assim que o envelope termina de abrir. */
  start: boolean;
  date: string;
}

const NAV = [
  { label: "Início", target: "#capa" },
  { label: "Nossa história", target: "#historia" },
  { label: "Detalhes", target: "#evento" },
  { label: "Presentes", target: "#presentes" },
  { label: "Confirmação", target: "#confirmar" },
];

const GOLD = "hsl(var(--wedding-gold))";

/** Arabesco decorativo sob a data — voluta simétrica com losango central. */
const Flourish = () => (
  <svg viewBox="-90 -14 180 28" className="mx-auto h-6 w-44" aria-hidden="true" fill="none">
    <g stroke={GOLD} strokeWidth="1" strokeLinecap="round">
      <path d="M-12 0 C -32 -8 -52 -8 -68 0 C -76 4 -84 2 -86 -3" />
      <path d="M12 0 C 32 -8 52 -8 68 0 C 76 4 84 2 86 -3" />
      <path d="M-20 4 C -34 8 -48 8 -60 5" opacity="0.6" strokeWidth="0.7" />
      <path d="M20 4 C 34 8 48 8 60 5" opacity="0.6" strokeWidth="0.7" />
      <circle cx="-86" cy="-5" r="1.6" fill={GOLD} stroke="none" />
      <circle cx="86" cy="-5" r="1.6" fill={GOLD} stroke="none" />
    </g>
    <rect x="-3.2" y="-3.2" width="6.4" height="6.4" transform="rotate(45)" fill={GOLD} />
  </svg>
);

const Hero = ({ start, date }: HeroProps) => {
  const lenis = useLenis();

  const scrollTo = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) lenis?.scrollTo(el, { duration: 1.6 });
  };

  /** Entrada em cascata: cada elemento entra logo depois do anterior. */
  const reveal = (i: number, extra?: CSSProperties) => ({
    className: start ? "animate-fade-up" : "opacity-0",
    style: {
      ...extra,
      ...(start ? { animationDelay: `${0.1 + i * 0.15}s`, animationFillMode: "both" as const } : {}),
    },
  });

  return (
    <section
      id="capa"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "hsl(var(--wedding-night))", color: "hsl(var(--wedding-cream))" }}
    >
      {/* Arte de fundo: casal, tratamento dourado, florais gravados e
          pó de luz já compostos na imagem */}
      {/* A arte original, sem qualquer redimensionamento: object-cover apenas
          recorta, nunca deforma. No mobile o recorte horizontal é ancorado a
          76% para manter o casal em quadro. */}
      <img
        src={fundo}
        alt="Arthur e Nicoly"
        className="absolute inset-0 h-full w-full object-cover object-[76%_center] lg:object-center"
      />
      {/* No mobile o casal fica atrás do texto — escurece para manter a leitura */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: "hsl(var(--wedding-night) / 0.55)" }}
      />

      {/* Menu — sobre a área escura da arte */}
      <nav
        {...reveal(0)}
        className={`absolute inset-x-0 top-0 z-20 px-6 pt-8 lg:w-[44%] lg:px-0 lg:pt-14 ${
          start ? "animate-fade-up" : "opacity-0"
        }`}
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:justify-start lg:gap-x-9 lg:pl-36">
          {NAV.map((item, i) => (
            <li key={item.target}>
              <button
                type="button"
                onClick={() => scrollTo(item.target)}
                className="group font-display font-semibold text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-100 lg:text-[13px]"
                style={{ color: "hsl(var(--wedding-cream))", opacity: i === 0 ? 1 : 0.72 }}
              >
                {item.label}
                <span
                  className="mx-auto mt-1.5 block h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: GOLD, width: i === 0 ? "100%" : 0 }}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Conteúdo — coluna centralizada na área escura da arte */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28 lg:w-[44%] lg:px-10">
        <div className="w-full max-w-xl text-center">
          <p
            {...reveal(1)}
            className={`font-display font-medium text-xs uppercase tracking-[0.42em] lg:text-lg ${
              start ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Convite de casamento
          </p>

          {/* Coraçãozinho entre filetes */}
          <div
            {...reveal(2)}
            className={`mt-4 flex items-center justify-center gap-3 ${
              start ? "animate-fade-up" : "opacity-0"
            }`}
          >
            <span className="h-px w-10" style={{ background: "hsl(var(--wedding-gold) / 0.55)" }} />
            <Heart className="h-2.5 w-2.5" fill={GOLD} style={{ color: GOLD }} />
            <span className="h-px w-10" style={{ background: "hsl(var(--wedding-gold) / 0.55)" }} />
          </div>

          <h1
            {...reveal(3)}
            className={`mt-6 font-script leading-[1.06] ${start ? "animate-fade-up" : "opacity-0"}`}
          >
            {/* Nomes escalonados na diagonal, como num convite caligrafado */}
            <span className="block -translate-x-[5%] text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem]">
              Arthur{" "}
              <span className="text-5xl sm:text-6xl lg:text-[5.5rem]" style={{ color: GOLD }}>
                &amp;
              </span>
            </span>
            <span className="block translate-x-[5%] text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem]">
              <Heart
                className="mr-4 inline-block h-4 w-4 -translate-y-3 lg:h-6 lg:w-6 lg:-translate-y-5"
                fill={GOLD}
                style={{ color: GOLD }}
              />
              Nicoly
            </span>
          </h1>

          {/* Data dourada entre filetes, com arabesco */}
          <div {...reveal(4)} className={`mt-10 ${start ? "animate-fade-up" : "opacity-0"}`}>
            <span
              className="mx-auto mb-4 block h-px w-56 lg:w-72"
              style={{ background: "hsl(var(--wedding-gold) / 0.55)" }}
            />
            <p
              className="font-display font-semibold text-base uppercase tracking-[0.32em] lg:text-2xl"
              style={{ color: GOLD }}
            >
              {date}
            </p>
            <span
              className="mx-auto mt-4 block h-px w-56 lg:w-72"
              style={{ background: "hsl(var(--wedding-gold) / 0.55)" }}
            />
            <div className="mt-3">
              <Flourish />
            </div>
          </div>

          {/* Botão champanhe com moldura dupla */}
          <div {...reveal(5)} className={`mt-9 ${start ? "animate-fade-up" : "opacity-0"}`}>
            <span
              className="inline-block rounded-[22px] p-[5px]"
              style={{ border: "1px solid hsl(var(--wedding-gold) / 0.55)" }}
            >
              <button
                type="button"
                onClick={() => scrollTo("#confirmar")}
                className="rounded-[16px] px-14 py-4 font-display font-semibold text-xs uppercase tracking-[0.28em] transition-transform duration-300 hover:scale-[1.02] lg:px-16 lg:text-base"
                style={{
                  background: "linear-gradient(180deg, hsl(42 52% 82%) 0%, hsl(38 40% 62%) 100%)",
                  color: "hsl(26 35% 14%)",
                  boxShadow: "0 10px 30px hsl(26 30% 4% / 0.55)",
                }}
              >
                Confirmar presença
              </button>
            </span>
          </div>

          {/* Chamada para rolar */}
          <div
            {...reveal(6)}
            className={`mt-10 flex flex-col items-center gap-3 ${
              start ? "animate-fade-up" : "opacity-0"
            }`}
          >
            <Heart className="h-3 w-3" fill={GOLD} style={{ color: GOLD }} />
            <button
              type="button"
              onClick={() => scrollTo("#versiculo")}
              className="flex flex-col items-center gap-1.5 font-display font-medium text-[11px] uppercase tracking-[0.32em] opacity-80 transition-opacity hover:opacity-100 lg:text-sm"
            >
              Deslize para baixo
              <ChevronDown className="h-4 w-4 animate-scroll-hint" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
