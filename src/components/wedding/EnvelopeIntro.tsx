import { useEffect, useState } from "react";

interface EnvelopeIntroProps {
  onComplete: () => void;
}

const EnvelopeIntro = ({ onComplete }: EnvelopeIntroProps) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "hsl(var(--wedding-bg))",
        animation: "envelope-fade 3s ease-in-out forwards",
      }}
      aria-hidden="true"
    >
      <div
        className="relative"
        style={{ width: "min(80vw, 320px)", aspectRatio: "3 / 2", perspective: "1000px" }}
      >
        {/* Letter inside */}
        <div
          className="absolute inset-x-4 top-4 bottom-6 rounded-sm shadow-md flex flex-col items-center justify-center px-4 text-center"
          style={{
            background: "hsl(var(--wedding-paper))",
            color: "hsl(var(--wedding-ink))",
            animation: "envelope-letter 3s ease-out forwards",
            zIndex: 1,
          }}
        >
          <p className="font-script text-4xl sm:text-5xl" style={{ color: "hsl(var(--wedding-rose))" }}>
            Arthur &amp; Nicoly
          </p>
          <p className="font-display tracking-[0.3em] text-xs sm:text-sm mt-2 uppercase">
            Vão se casar
          </p>
        </div>

        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-sm shadow-xl"
          style={{ background: "hsl(var(--wedding-rose))", zIndex: 2 }}
        />
        {/* Inside pocket (front) */}
        <div
          className="absolute inset-x-0 bottom-0 rounded-b-sm"
          style={{
            height: "60%",
            background: "hsl(var(--wedding-rose))",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            zIndex: 3,
          }}
        />
        {/* Flap */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "100%",
            transformOrigin: "top center",
            animation: "envelope-flap 3s ease-in-out forwards",
            zIndex: 4,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              margin: "0 auto",
              borderLeft: "min(40vw, 160px) solid transparent",
              borderRight: "min(40vw, 160px) solid transparent",
              borderTop: "min(26vw, 104px) solid hsl(var(--wedding-rose))",
              filter: "brightness(0.92)",
            }}
          />
        </div>
        {/* Wax seal */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center font-script text-lg shadow-md"
          style={{
            top: "38%",
            width: "clamp(36px, 10vw, 52px)",
            height: "clamp(36px, 10vw, 52px)",
            background: "hsl(var(--wedding-gold))",
            color: "hsl(var(--wedding-bg))",
            zIndex: 5,
            opacity: 0.95,
          }}
        >
          A&amp;N
        </div>
      </div>
    </div>
  );
};

export default EnvelopeIntro;