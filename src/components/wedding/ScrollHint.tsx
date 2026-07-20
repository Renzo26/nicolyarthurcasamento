import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

const ScrollHint = () => {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    // Aparece logo após o envelope encerrar
    const t = setTimeout(() => setVisible(true), 3200);

    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Esconde quando o usuário já está próximo do fim da página
      const nearEnd = max > 0 && scrolled / max > 0.85;
      // Mostra de novo se voltar ao topo
      setVisible(!nearEnd);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClick = () => {
    lenis?.scrollTo(window.scrollY + window.innerHeight * 0.9, { duration: 1.2 });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Continuar rolando"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 animate-fade-up group"
    >
      <span
        className="font-display tracking-[0.3em] text-[10px] sm:text-xs uppercase px-3 py-1 rounded-full backdrop-blur-sm"
        style={{
          color: "hsl(var(--wedding-ink))",
          background: "hsl(var(--wedding-bg) / 0.7)",
          border: "1px solid hsl(var(--wedding-gold) / 0.4)",
        }}
      >
        Role para descobrir
      </span>
      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-full animate-soft-pulse transition-transform group-hover:scale-110"
        style={{
          background: "hsl(var(--wedding-rose))",
          color: "white",
          boxShadow: "0 4px 14px hsl(var(--wedding-rose) / 0.35)",
        }}
      >
        <span className="relative h-6 w-4">
          <ChevronDown className="absolute inset-x-0 top-0 h-4 w-4 animate-chevron-1" strokeWidth={2.5} />
          <ChevronDown className="absolute inset-x-0 top-0 h-4 w-4 animate-chevron-2" strokeWidth={2.5} />
          <ChevronDown className="absolute inset-x-0 top-0 h-4 w-4 animate-chevron-3" strokeWidth={2.5} />
        </span>
      </span>
    </button>
  );
};

export default ScrollHint;