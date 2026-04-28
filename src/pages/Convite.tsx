import { useState } from "react";
import { MapPin, Navigation, Calendar, Heart, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EnvelopeIntro from "@/components/wedding/EnvelopeIntro";
import ScrollHint from "@/components/wedding/ScrollHint";
import Section from "@/components/wedding/Section";
import RsvpSection from "@/components/wedding/RsvpSection";
import casal1 from "@/assets/casal-1.jpeg";
import casal2 from "@/assets/casal-2.jpeg";
import casal3 from "@/assets/casal-3.jpeg";
import casal4 from "@/assets/casal-4.jpeg";

// TODO: substituir pelos dados reais
const EVENT = {
  date: "DD de mês de AAAA",
  time: "00h00",
  venueName: "Nome do Local",
  address: "Rua Exemplo, 123 — Bairro, Cidade — UF",
  // Coordenadas exemplo — troque depois
  lat: -23.55052,
  lng: -46.633308,
};

const PIX = {
  key: "chave-pix@exemplo.com",
  label: "Arthur & Nicoly",
};

const Convite = () => {
  const [introDone, setIntroDone] = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${EVENT.lat},${EVENT.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${EVENT.lat},${EVENT.lng}&navigate=yes`;
  const appleUrl = `http://maps.apple.com/?ll=${EVENT.lat},${EVENT.lng}&q=${encodeURIComponent(EVENT.venueName)}`;

  const copyPix = () => {
    navigator.clipboard.writeText(PIX.key);
    toast.success("Chave PIX copiada!");
  };

  return (
    <main
      className="w-full"
      style={{ background: "hsl(var(--wedding-bg))", color: "hsl(var(--wedding-ink))" }}
    >
      <EnvelopeIntro onComplete={() => setIntroDone(true)} />
      {introDone && <ScrollHint />}

      {/* TELA 1 — Capa após envelope */}
      <Section id="capa">
        <div className="text-center space-y-6">
          <p className="font-body text-xs uppercase tracking-[0.4em] opacity-60">
            Convite de casamento
          </p>
          <h1
            className="font-script text-7xl sm:text-8xl leading-none"
            style={{ color: "hsl(var(--wedding-rose))" }}
          >
            Arthur<br />
            <span className="font-display italic text-4xl sm:text-5xl opacity-80">&</span>
            <br />
            Nicoly
          </h1>
          <div
            className="mx-auto w-16 h-px"
            style={{ background: "hsl(var(--wedding-gold))" }}
          />
          <p className="font-display text-lg tracking-[0.2em] uppercase">
            {EVENT.date}
          </p>
        </div>
      </Section>

      {/* TELA 2 — Versículo */}
      <Section id="versiculo" className="!bg-[hsl(var(--wedding-paper))]">
        <div className="text-center space-y-8">
          <Heart
            className="mx-auto h-6 w-6"
            style={{ color: "hsl(var(--wedding-rose))" }}
          />
          <blockquote className="font-display italic text-2xl sm:text-3xl leading-relaxed">
            “O amor é paciente, o amor é bondoso.<br />
            Não inveja, não se vangloria, não se orgulha.<br />
            Não maltrata, não procura seus interesses,<br />
            não se ira facilmente, não guarda rancor.<br />
            O amor não se alegra com a injustiça,<br />
            mas se alegra com a verdade.<br />
            Tudo sofre, tudo crê, tudo espera,<br />
            tudo suporta.”
          </blockquote>
          <p
            className="font-body tracking-[0.3em] text-xs uppercase"
            style={{ color: "hsl(var(--wedding-gold))" }}
          >
            1 Coríntios 13:4-7
          </p>

          <div className="grid grid-cols-3 gap-3 pt-6">
            {[casal1, casal4, casal3].map((src, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-md overflow-hidden shadow-sm"
                style={{ border: "1px solid hsl(var(--wedding-gold) / 0.4)" }}
              >
                <img
                  src={src}
                  alt={`Arthur e Nicoly ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* TELA 3 — Data, local e mapa */}
      <Section id="evento">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <p className="font-body text-xs uppercase tracking-[0.3em] opacity-60">
              Save the date
            </p>
            <p className="font-script text-5xl" style={{ color: "hsl(var(--wedding-rose))" }}>
              Quando & Onde
            </p>
          </div>

          <div
            className="aspect-[16/9] rounded-lg overflow-hidden shadow-md"
            style={{ border: "1px solid hsl(var(--wedding-gold) / 0.4)" }}
          >
            <img
              src={casal4}
              alt="Arthur e Nicoly no parque"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div
              className="rounded-lg p-6 text-center space-y-2"
              style={{ background: "hsl(var(--wedding-paper))" }}
            >
              <Calendar className="mx-auto h-5 w-5" style={{ color: "hsl(var(--wedding-rose))" }} />
              <p className="font-body text-xs uppercase tracking-widest opacity-60">Data</p>
              <p className="font-display text-xl">{EVENT.date}</p>
              <p className="font-body text-sm opacity-70">{EVENT.time}</p>
            </div>
            <div
              className="rounded-lg p-6 text-center space-y-2"
              style={{ background: "hsl(var(--wedding-paper))" }}
            >
              <MapPin className="mx-auto h-5 w-5" style={{ color: "hsl(var(--wedding-rose))" }} />
              <p className="font-body text-xs uppercase tracking-widest opacity-60">Local</p>
              <p className="font-display text-xl">{EVENT.venueName}</p>
              <p className="font-body text-sm opacity-70">{EVENT.address}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-center font-body text-xs uppercase tracking-[0.25em] opacity-60">
              Como chegar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button asChild variant="outline" className="h-12">
                <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4 mr-2" /> Waze
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="h-4 w-4 mr-2" /> Google Maps
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12">
                <a href={appleUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="h-4 w-4 mr-2" /> Apple Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* TELA 4 — Sem presentes / PIX */}
      <Section id="presentes" className="!bg-[hsl(var(--wedding-paper))]">
        <div className="space-y-8 text-center">
          <AlertCircle
            className="mx-auto h-7 w-7"
            style={{ color: "hsl(var(--wedding-rose))" }}
          />
          <p className="font-script text-5xl" style={{ color: "hsl(var(--wedding-rose))" }}>
            Um recadinho
          </p>
          <div className="font-display text-lg leading-relaxed max-w-xl mx-auto space-y-4">
            <p>
              Com muito carinho, queremos avisar que <strong>já mobiliamos toda a nossa casa</strong>,
              então, por gentileza, <strong>não compre presentes para nós</strong>.
            </p>
            <p>
              Sua presença já é o nosso maior presente. 💛
            </p>
            <p className="font-body text-sm opacity-75">
              Caso ainda assim queira nos abençoar, ficaremos imensamente felizes em receber via PIX:
            </p>
          </div>

          <div
            className="mx-auto max-w-sm rounded-xl p-6 space-y-4"
            style={{ background: "hsl(var(--wedding-bg))" }}
          >
            {/* QR placeholder */}
            <div
              className="mx-auto w-48 h-48 rounded-lg flex items-center justify-center text-xs opacity-50"
              style={{
                background: "white",
                border: "1px dashed hsl(var(--wedding-gold) / 0.6)",
              }}
            >
              QR Code do PIX
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-widest opacity-60">Chave PIX</p>
              <p className="font-display text-lg break-all">{PIX.key}</p>
              <p className="font-body text-xs opacity-60 mt-1">{PIX.label}</p>
            </div>
            <Button
              onClick={copyPix}
              className="w-full h-11"
              style={{ background: "hsl(var(--wedding-rose))", color: "white" }}
            >
              <Copy className="h-4 w-4 mr-2" /> Copiar chave PIX
            </Button>
          </div>
        </div>
      </Section>

      {/* TELA 5 — Confirmação */}
      <Section id="confirmar">
        <RsvpSection />
      </Section>

      <footer
        className="py-8 text-center font-script text-2xl"
        style={{ background: "hsl(var(--wedding-paper))", color: "hsl(var(--wedding-rose))" }}
      >
        Arthur &amp; Nicoly
      </footer>
    </main>
  );
};

export default Convite;