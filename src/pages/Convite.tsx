import { useState } from "react";
import Envelope from "@/components/wedding/Envelope";
import Versiculo from "@/components/wedding/Versiculo";
import Evento from "@/components/wedding/Evento";
import Pix from "@/components/wedding/Pix";
import RSVP from "@/components/wedding/RSVP";

const Convite = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!opened && <Envelope onOpen={() => setOpened(true)} />}
      {opened && (
        <main className="animate-fade-in-slow opacity-0">
          <Evento />
          <Versiculo />
          <Pix />
          <RSVP />
          <footer className="bg-background py-10 text-center">
            <p className="font-script text-2xl text-gold">Arthur & Nicoly</p>
            <p className="mt-2 font-serif-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Com amor
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default Convite;