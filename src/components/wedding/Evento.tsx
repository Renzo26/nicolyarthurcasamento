import { useState } from "react";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADDRESS = "Endereço a definir, Cidade — Estado";
const ENCODED = encodeURIComponent(ADDRESS);

const Evento = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-ivory px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif-display text-sm uppercase tracking-[0.4em] text-gold animate-fade-in opacity-0">
          Save the date
        </p>

        <h1 className="mt-6 font-script text-6xl text-foreground sm:text-7xl animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          Arthur
          <span className="mx-3 text-gold">&</span>
          Nicoly
        </h1>

        <div className="mx-auto mt-8 h-px w-24 bg-gold/60" />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Calendar, label: "Data", value: "A definir" },
            { icon: Clock, label: "Horário", value: "00:00" },
            { icon: MapPin, label: "Local", value: "A definir" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="rounded-lg border border-gold/20 bg-white/70 p-6 backdrop-blur shadow-soft animate-fade-in opacity-0"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <item.icon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-3 font-serif-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 font-serif-display text-lg text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-serif-display text-base italic text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "0.5s" }}>
          {ADDRESS}
        </p>

        <Button
          onClick={() => setOpen(true)}
          className="mt-8 rounded-full bg-gradient-gold px-8 py-6 font-serif-display text-sm uppercase tracking-[0.3em] text-white shadow-soft hover:opacity-90 animate-fade-in opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Como chegar
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center font-serif-display text-2xl">Como chegar</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${ENCODED}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-gold/30 bg-white px-4 py-3 text-center font-serif-display text-base transition hover:bg-accent"
            >
              Google Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${ENCODED}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-gold/30 bg-white px-4 py-3 text-center font-serif-display text-base transition hover:bg-accent"
            >
              Waze
            </a>
            <a
              href={`https://maps.apple.com/?q=${ENCODED}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-gold/30 bg-white px-4 py-3 text-center font-serif-display text-base transition hover:bg-accent"
            >
              Apple Maps
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Evento;