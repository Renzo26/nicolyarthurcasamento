import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      const t = setTimeout(onOpen, 2400);
      return () => clearTimeout(t);
    }
  }, [opened, onOpen]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-ivory px-6">
      <p className="mb-12 text-center font-serif-display text-base italic text-muted-foreground animate-fade-in-slow opacity-0">
        Você está convidado para um momento especial
      </p>

      <div
        className="relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => !opened && setOpened(true)}
      >
        {/* Envelope body */}
        <div className="relative h-48 w-72 rounded-sm bg-gradient-to-br from-[hsl(33,40%,96%)] to-[hsl(30,25%,88%)] shadow-elegant sm:h-56 sm:w-96">
          {/* Letter peeking out */}
          <div
            className={`absolute left-1/2 top-1/2 flex h-40 w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-sm bg-white shadow-soft transition-all duration-1000 sm:h-48 sm:w-80 ${
              opened ? "-translate-y-[120%] opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: opened ? 1 : 0 }}
          >
            <p className="font-script text-3xl text-gold sm:text-4xl">Arthur & Nicoly</p>
            <div className="mt-2 h-px w-16 bg-gold" />
            <p className="mt-2 font-serif-display text-sm tracking-[0.3em] text-muted-foreground">
              CONVITE
            </p>
          </div>

          {/* Flap */}
          <div
            className="absolute left-0 top-0 h-full w-full origin-top transition-transform duration-700"
            style={{
              transform: opened ? "rotateX(-180deg)" : "rotateX(0deg)",
              transformStyle: "preserve-3d",
              zIndex: 2,
            }}
          >
            <div
              className="absolute left-0 top-0 h-0 w-0"
              style={{
                borderLeft: "144px solid transparent",
                borderRight: "144px solid transparent",
                borderTop: "96px solid hsl(36 39% 61%)",
              }}
            />
          </div>

          {/* Wax seal */}
          {!opened && (
            <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-gold shadow-soft animate-shimmer">
              <Heart className="h-6 w-6 fill-white text-white" />
            </div>
          )}
        </div>

        {!opened && (
          <button
            onClick={() => setOpened(true)}
            className="mt-10 block w-full rounded-full border border-gold/40 bg-white/60 px-8 py-3 font-serif-display text-sm uppercase tracking-[0.3em] text-gold backdrop-blur transition hover:bg-gold hover:text-white"
          >
            Abrir convite
          </button>
        )}
      </div>
    </div>
  );
};

export default Envelope;