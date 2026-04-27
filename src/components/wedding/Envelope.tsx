import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  onOpened: () => void;
}

const Envelope = ({ onOpened }: Props) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(true);
      onOpened();
    }, 3000);
    return () => clearTimeout(t);
  }, [onOpened]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-romantic animate-envelope-fade overflow-hidden">
      {/* pétalas decorativas */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-rose/60 animate-petal-fall"
            style={{
              left: `${(i * 13) % 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${8 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Carta saindo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-64 h-40 rounded-md bg-card shadow-soft flex flex-col items-center justify-center px-6 opacity-0 animate-envelope-letter">
          <p className="font-script text-3xl text-rose-deep">Você é nosso convidado</p>
          <div className="mt-2 flex items-center gap-2 text-foreground/70">
            <Heart className="h-3 w-3 fill-rose-deep text-rose-deep" />
            <span className="font-display tracking-widest text-xs uppercase">Nicoly &amp; Arthur</span>
            <Heart className="h-3 w-3 fill-rose-deep text-rose-deep" />
          </div>
        </div>

        {/* Envelope */}
        <div className="relative z-10 w-64 h-40 rounded-md bg-envelope shadow-petal overflow-hidden">
          {/* corpo */}
          <div className="absolute inset-0 bg-envelope" />
          {/* lacre/coração */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-rose-deep flex items-center justify-center shadow-soft">
            <Heart className="h-4 w-4 fill-card text-card" />
          </div>
          {/* aba superior - anima */}
          <div
            className="absolute top-0 left-0 w-0 h-0 z-20 animate-envelope-flap"
            style={{
              borderLeft: "128px solid transparent",
              borderRight: "128px solid transparent",
              borderTop: "100px solid hsl(var(--rose))",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Envelope;