import { Copy, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PIX_KEY = "arthur.nicoly@email.com";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(PIX_KEY)}&color=2A2520&bgcolor=FFFFFF&margin=10`;

const Pix = () => {
  const copy = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-script text-4xl text-gold sm:text-5xl animate-fade-in opacity-0">
          Com carinho
        </p>
        <div className="mx-auto mt-6 h-px w-20 bg-gold/60" />

        <p className="mt-8 font-serif-display text-lg italic leading-relaxed text-foreground/80 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          Organizamos cada detalhe deste momento com muito amor.
          <br />
          Caso não possa comparecer, pedimos que evite cancelamentos de última hora.
          <br />
          Se desejar nos presentear, ficaremos felizes com uma contribuição via PIX.
        </p>

        <div className="mx-auto mt-10 max-w-xs rounded-2xl border border-gold/20 bg-gradient-ivory p-8 shadow-elegant animate-scale-in opacity-0" style={{ animationDelay: "0.2s" }}>
          <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-lg bg-white p-3 shadow-soft">
            <img src={QR_URL} alt="QR Code PIX" className="h-full w-full object-contain" />
          </div>

          <div className="mt-6">
            <p className="font-serif-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Chave PIX
            </p>
            <p className="mt-2 break-all font-serif-display text-base text-foreground">{PIX_KEY}</p>
          </div>

          <Button
            onClick={copy}
            variant="outline"
            className="mt-4 w-full rounded-full border-gold/40 font-serif-display uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar chave
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pix;