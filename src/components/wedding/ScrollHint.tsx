import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollHint = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show shortly after envelope finishes
    const t = setTimeout(() => setVisible(true), 3200);
    const onScroll = () => {
      if (window.scrollY > 80) setVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1 animate-fade-up"
      style={{ color: "hsl(var(--wedding-ink))" }}
    >
      <span className="font-display tracking-[0.25em] text-xs uppercase opacity-70">
        Role para descobrir
      </span>
      <ChevronDown className="h-5 w-5 animate-scroll-hint" />
    </div>
  );
};

export default ScrollHint;