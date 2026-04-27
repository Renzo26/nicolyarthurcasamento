import { Calendar, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADDRESS = "Endereço do evento — a definir";
const ENCODED = encodeURIComponent(ADDRESS);

const SectionEvent = () => {
  return (
    <section
      id="event"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-cream relative overflow-hidden"
    >
      <div className="max-w-xl mx-auto w-full space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <p className="font-script text-4xl text-rose-deep">Save the Date</p>
          <div className="h-px w-16 bg-rose-deep/40 mx-auto" />
        </div>

        {/* Foto destaque */}
        <div className="aspect-[4/3] rounded-3xl bg-card shadow-soft flex items-center justify-center text-muted-foreground border border-border">
          Foto do casal
        </div>

        {/* Data */}
        <div className="text-center space-y-2">
          <Calendar className="h-6 w-6 mx-auto text-rose-deep" />
          <p className="font-display text-3xl md:text-4xl text-foreground">Data a definir</p>
          <p className="text-muted-foreground">Horário a definir</p>
        </div>

        {/* Local */}
        <div className="rounded-2xl bg-card shadow-soft p-6 space-y-4 border border-border">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-rose-deep mt-1 shrink-0" />
            <div>
              <p className="font-display text-xl text-foreground">Local da cerimônia</p>
              <p className="text-sm text-muted-foreground mt-1">{ADDRESS}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <Button asChild variant="outline" className="border-rose-deep/30 hover:bg-blush">
              <a
                href={`https://waze.com/ul?q=${ENCODED}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4 mr-1" /> Waze
              </a>
            </Button>
            <Button asChild variant="outline" className="border-rose-deep/30 hover:bg-blush">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${ENCODED}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4 mr-1" /> Google Maps
              </a>
            </Button>
            <Button asChild variant="outline" className="border-rose-deep/30 hover:bg-blush">
              <a
                href={`https://maps.apple.com/?q=${ENCODED}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4 mr-1" /> Apple Maps
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionEvent;