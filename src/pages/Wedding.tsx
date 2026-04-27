import { useState } from "react";
import Envelope from "@/components/wedding/Envelope";
import SectionVerse from "@/components/wedding/SectionVerse";
import SectionEvent from "@/components/wedding/SectionEvent";
import SectionGifts from "@/components/wedding/SectionGifts";
import SectionRSVP from "@/components/wedding/SectionRSVP";

const Wedding = () => {
  const [opened, setOpened] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Envelope onOpened={() => setOpened(true)} />

      <div
        className={
          opened
            ? "opacity-100 transition-opacity duration-700"
            : "opacity-0"
        }
      >
        <h1 className="sr-only">Casamento de Nicoly e Arthur</h1>
        <SectionVerse />
        <SectionEvent />
        <SectionGifts />
        <SectionRSVP />

        <footer className="py-10 text-center text-sm text-muted-foreground bg-cream">
          <p className="font-script text-2xl text-rose-deep">Nicoly &amp; Arthur</p>
          <p className="mt-1">Com amor, esperamos por você 💕</p>
        </footer>
      </div>
    </main>
  );
};

export default Wedding;