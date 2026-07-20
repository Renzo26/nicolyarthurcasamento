import { useState } from "react";
import { MapPin, Navigation, Calendar, Heart, Copy, Apple, QrCode } from "lucide-react";
import { toast } from "sonner";
import EnvelopeIntro from "@/components/wedding/EnvelopeIntro";
import Hero from "@/components/wedding/Hero";
import Section from "@/components/wedding/Section";
import StorySection from "@/components/wedding/StorySection";
import RsvpSection from "@/components/wedding/RsvpSection";
import Ornament from "@/components/wedding/Ornament";
import Flourish from "@/components/wedding/Flourish";
import Medallion from "@/components/wedding/Medallion";
import casal2 from "@/assets/casal-2.jpeg";
import casal4 from "@/assets/casal-4.jpeg";
import moldura from "@/assets/moldura.jpg";

const EVENT = {
  date: "17 de outubro de 2026",
  time: "13h00",
  venueName: "Chácara Lasareff",
  addressLine1: "Estrada Rio Pequeno, 2555 — Vila Lídia",
  addressLine2: "Rio Grande da Serra — SP",
};

const PIX = {
  key: "chave-pix@exemplo.com",
  label: "Arthur & Nicoly",
};

const GOLD = "hsl(var(--wedding-gold))";
const GOLD_LINE = "hsl(var(--wedding-gold) / 0.5)";

/**
 * Título em caligrafia metalizada. O halo vai em text-shadow (segue o
 * contorno das letras) — drop-shadow desenharia a caixa do gradiente.
 */
const glowTitle = (tone: "gold" | "cream") => ({
  backgroundImage:
    tone === "gold"
      ? "linear-gradient(180deg, hsl(44 65% 88%) 0%, hsl(40 55% 68%) 45%, hsl(36 45% 52%) 100%)"
      : "linear-gradient(180deg, hsl(44 45% 97%) 0%, hsl(40 30% 88%) 55%, hsl(38 25% 78%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent",
  textShadow: `0 0 32px hsl(40 65% 58% / ${tone === "gold" ? 0.45 : 0.28})`,
});

/** Arte pronta de moldura: filete dourado, buquês nos cantos e brilho quente. */
const FrameArt = () => (
  <img
    src={moldura}
    alt=""
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
  />
);

/** Botão vazado dourado sobre o fundo escuro. */
const MapButton = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof MapPin;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-md font-body text-sm transition-colors"
    style={{ border: `1px solid ${GOLD_LINE}`, color: "hsl(var(--wedding-cream))" }}
  >
    <span
      className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      style={{ background: "hsl(var(--wedding-gold) / 0.16)" }}
    />
    <Icon className="relative h-4 w-4" style={{ color: GOLD }} />
    <span className="relative">{children}</span>
  </a>
);

const Convite = () => {
  const [introDone, setIntroDone] = useState(false);

  const fullAddress = `${EVENT.venueName}, ${EVENT.addressLine1}, ${EVENT.addressLine2}`;
  const encoded = encodeURIComponent(fullAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const wazeUrl = `https://waze.com/ul?q=${encoded}&navigate=yes`;
  const appleUrl = `http://maps.apple.com/?q=${encoded}`;

  const copyPix = () => {
    navigator.clipboard.writeText(PIX.key);
    toast.success("Chave PIX copiada!");
  };

  return (
    <main
      className="w-full"
      style={{ background: "hsl(var(--wedding-night))", color: "hsl(var(--wedding-cream))" }}
    >
      <EnvelopeIntro onComplete={() => setIntroDone(true)} />

      {/* TELA 1 — Capa */}
      <Hero start={introDone} date={EVENT.date} />

      {/* TELA 2 — Versículo */}
      <Section id="versiculo" width="wide" bgImage={casal4} bgBlur={12} overlay={0.84}>
        <div className="relative mx-auto max-w-4xl">
          <Ornament
            className="pointer-events-none absolute -bottom-16 -left-16 hidden h-72 w-56 lg:block"
            opacity={0.45}
          />
          <Ornament
            className="pointer-events-none absolute -bottom-16 -right-16 hidden h-72 w-56 lg:block"
            opacity={0.45}
            flip
          />

          {/* Card de vidro com moldura dourada */}
          <div
            className="relative rounded-2xl px-6 py-12 text-center sm:px-12 lg:px-20 lg:py-20"
            style={{
              border: `1px solid ${GOLD_LINE}`,
              background: "hsl(var(--wedding-night) / 0.55)",
              backdropFilter: "blur(3px)",
            }}
          >
            <Heart
              className="mx-auto h-7 w-7"
              fill="hsl(var(--wedding-cream))"
              style={{ color: "hsl(var(--wedding-cream))" }}
            />

            <blockquote className="mt-8 font-display italic leading-relaxed text-xl sm:text-2xl lg:text-4xl">
              “O amor é paciente, o amor é bondoso.<br />
              Não inveja, não se vangloria, não se orgulha.<br />
              Não maltrata, não procura seus interesses,<br />
              não se ira facilmente, não guarda rancor.<br />
              O amor não se alegra com a injustiça,<br />
              mas se alegra com a verdade.<br />
              Tudo sofre, tudo crê, tudo espera,<br />
              tudo suporta.”
            </blockquote>

            {/* Divisor —— ◆ —— */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <span className="h-px w-20 lg:w-32" style={{ background: GOLD_LINE }} />
              <span className="rotate-45" style={{ background: GOLD, width: 6, height: 6 }} />
              <span className="h-px w-20 lg:w-32" style={{ background: GOLD_LINE }} />
            </div>

            <p
              className="mt-6 font-body text-xs lg:text-sm uppercase tracking-[0.35em]"
              style={{ color: GOLD }}
            >
              1 Coríntios 13:4-7
            </p>
          </div>
        </div>
      </Section>

      {/* TELA 3 — Nossa história */}
      <StorySection />

      {/* TELA 4 — Data, local e mapa */}
      <Section id="evento" width="wide" bgImage={casal2} bgBlur={22} overlay={0.88}>
        <div className="text-center">
          <p className="font-body text-xs lg:text-sm uppercase tracking-[0.45em]">Save the date</p>
          <h2 className="mt-4 font-script text-6xl lg:text-8xl xl:text-9xl">Quando &amp; Onde</h2>

          {/* Data | ♡ | Local */}
          <div className="mt-16 flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-0">
            <div className="flex-1 space-y-3">
              <Calendar className="mx-auto h-9 w-9 lg:h-11 lg:w-11" style={{ color: GOLD }} strokeWidth={1.2} />
              <p className="font-display text-2xl lg:text-4xl">{EVENT.date}</p>
              <p className="font-display text-xl lg:text-3xl opacity-90">{EVENT.time}</p>
            </div>

            {/* Divisor vertical com coração (horizontal no mobile) */}
            <div className="flex shrink-0 items-center justify-center lg:h-56 lg:w-24 lg:flex-col">
              <span className="h-px flex-1 lg:h-auto lg:w-px lg:flex-1" style={{ background: GOLD_LINE }} />
              <Heart
                className="mx-4 h-4 w-4 lg:mx-0 lg:my-4"
                fill={GOLD}
                style={{ color: GOLD }}
              />
              <span className="h-px flex-1 lg:h-auto lg:w-px lg:flex-1" style={{ background: GOLD_LINE }} />
            </div>

            <div className="flex-1 space-y-3">
              <MapPin className="mx-auto h-9 w-9 lg:h-11 lg:w-11" style={{ color: GOLD }} strokeWidth={1.2} />
              <p className="font-display text-2xl lg:text-4xl">{EVENT.venueName}</p>
              <p className="font-display text-lg lg:text-2xl opacity-90">{EVENT.addressLine1}</p>
              <p className="font-display text-lg lg:text-2xl opacity-90">{EVENT.addressLine2}</p>
            </div>
          </div>

          {/* Como chegar */}
          <div className="mt-16">
            <p className="font-body text-xs uppercase tracking-[0.4em]" style={{ color: GOLD }}>
              Como chegar
            </p>
            <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
              <MapButton href={wazeUrl} icon={Navigation}>
                Waze
              </MapButton>
              <MapButton href={mapsUrl} icon={MapPin}>
                Google Maps
              </MapButton>
              <MapButton href={appleUrl} icon={Apple}>
                Apple Maps
              </MapButton>
            </div>
          </div>
        </div>
      </Section>

      {/* TELA 5 — Sem presentes / PIX */}
      <Section id="presentes" width="wide" decor={<FrameArt />}>
        <div className="relative lg:grid lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-20">
          {/* Recado */}
          <div className="text-center lg:text-left">
            <Medallion
              motif="sprig"
              topHeart
              className="mx-auto h-28 w-24 lg:mx-0 lg:h-32 lg:w-28"
            />

            <h2
              className="mt-6 font-script text-6xl leading-[1.1] lg:text-8xl"
              style={glowTitle("cream")}
            >
              Um recadinho
            </h2>
            <Flourish className="mt-4 lg:justify-start" />

            <div className="mx-auto mt-10 max-w-xl space-y-6 font-display text-lg leading-relaxed lg:mx-0 lg:text-2xl">
              <p style={{ color: GOLD }}>
                Com muito carinho, queremos avisar que já mobiliamos toda a nossa casa, então, por
                gentileza, não compre presentes para nós.
              </p>
              <p>
                Sua presença já é o nosso maior presente.{" "}
                <Heart
                  className="ml-1 inline-block h-5 w-5 align-[-0.15em]"
                  fill={GOLD}
                  style={{ color: GOLD }}
                />
              </p>
              <p className="text-base lg:text-xl opacity-85">
                Caso ainda assim queira nos abençoar, ficaremos imensamente felizes em receber via
                PIX:
              </p>
            </div>
          </div>

          {/* Cartão do PIX com borda luminosa */}
          <div
            className="mx-auto mt-14 w-full max-w-sm rounded-[2rem] p-1.5 lg:mt-0"
            style={{
              border: "1px solid hsl(var(--wedding-gold) / 0.45)",
              boxShadow: "0 0 45px hsl(40 60% 50% / 0.22)",
            }}
          >
            <div
              className="space-y-5 rounded-[1.6rem] px-6 py-8"
              style={{
                border: "1px solid hsl(var(--wedding-gold) / 0.55)",
                background: "hsl(var(--wedding-night-soft) / 0.55)",
              }}
            >
              <Flourish variant="scroll" className="mx-auto h-5 w-32" opacity={0.9} />

              <div
                className="mx-auto flex aspect-square w-full max-w-[15rem] flex-col items-center justify-center gap-3 rounded-2xl"
                style={{ background: "hsl(40 30% 97%)", color: "hsl(var(--wedding-ink))" }}
              >
                <QrCode className="h-9 w-9 opacity-45" strokeWidth={1.4} />
                <span className="font-display text-base">QR Code do PIX</span>
              </div>

              <Flourish className="!gap-2" />

              <div className="text-center">
                <p
                  className="font-display font-semibold text-xs uppercase tracking-[0.32em]"
                  style={{ color: GOLD }}
                >
                  Chave PIX
                </p>
                <p className="mt-3 break-all font-display text-xl">{PIX.key}</p>
                <p className="mt-2 font-display text-sm opacity-70">{PIX.label}</p>
              </div>

              <Flourish className="!gap-2" />

              <button
                type="button"
                onClick={copyPix}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl font-display font-semibold text-xs uppercase tracking-[0.26em] lg:text-sm"
                style={{ border: `1px solid ${GOLD_LINE}`, color: GOLD }}
              >
                <span
                  className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: "hsl(var(--wedding-gold) / 0.16)" }}
                />
                <Copy className="relative h-4 w-4" />
                <span className="relative">Copiar chave PIX</span>
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* TELA 6 — Confirmação */}
      <Section
        id="confirmar"
        width="wide"
        decor={<FrameArt />}
      >
        <div className="relative mx-auto max-w-5xl px-2 py-6 text-center lg:py-10">
          <Medallion motif="heart" className="mx-auto h-24 w-24 lg:h-28 lg:w-28" />
          <Flourish variant="scroll" className="mx-auto mt-2 h-5 w-28" opacity={0.8} />

          <h2
            className="mt-4 font-script text-5xl leading-[1.15] sm:text-6xl lg:text-8xl"
            style={glowTitle("gold")}
          >
            Confirme sua presença
          </h2>
          <Flourish className="mt-5" />

          <p className="mx-auto mt-8 max-w-lg font-display text-lg leading-relaxed opacity-90 lg:text-xl">
            Digite o nome do responsável pela família ou de qualquer convidado para encontrar seu
            convite.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <RsvpSection />
          </div>
        </div>
      </Section>

      <footer
        className="relative overflow-hidden py-20 text-center lg:py-28"
        style={{ background: "hsl(var(--wedding-night))" }}
      >
        <Ornament
          className="pointer-events-none absolute -bottom-10 left-4 h-48 w-36 lg:h-60 lg:w-44"
          opacity={0.25}
        />
        <Ornament
          className="pointer-events-none absolute -bottom-10 right-4 h-48 w-36 lg:h-60 lg:w-44"
          opacity={0.25}
          flip
        />
        <p className="font-script text-6xl lg:text-8xl" style={{ color: "hsl(var(--wedding-cream))" }}>
          Arthur &amp; Nicoly
        </p>
        <div className="mx-auto my-6 flex items-center justify-center gap-4">
          <span className="h-px w-14 lg:w-20" style={{ background: GOLD_LINE }} />
          <Heart className="h-3 w-3" fill={GOLD} style={{ color: GOLD }} />
          <span className="h-px w-14 lg:w-20" style={{ background: GOLD_LINE }} />
        </div>
        <p className="font-body text-xs uppercase tracking-[0.4em]" style={{ color: GOLD }}>
          {EVENT.date}
        </p>
      </footer>
    </main>
  );
};

export default Convite;
