import { Gift, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const PIX_KEY = "chave-pix-aqui@exemplo.com";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(PIX_KEY)}`;

const SectionGifts = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      toast.success("Chave Pix copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <section
      id="gifts"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-romantic relative overflow-hidden"
    >
      <div className="max-w-xl mx-auto w-full space-y-8 text-center relative z-10">
        <div className="space-y-3">
          <Gift className="h-8 w-8 mx-auto text-rose-deep" />
          <p className="font-script text-4xl text-rose-deep">Presentes</p>
          <div className="h-px w-16 bg-rose-deep/40 mx-auto" />
        </div>

        <div className="rounded-2xl bg-card shadow-soft p-6 md:p-8 border border-border space-y-5 text-left">
          <p className="font-display text-xl text-foreground leading-relaxed text-center">
            Com muito carinho, queremos avisar que <strong>já mobiliamos nosso lar</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed text-center">
            Por isso, optamos por <strong>cancelar a lista tradicional de presentes</strong>.
            Sua presença em nosso casamento já é o maior presente que poderíamos receber. 💕
          </p>
          <p className="text-muted-foreground leading-relaxed text-center">
            Se mesmo assim quiser nos presentear, ficaremos imensamente gratos por uma contribuição
            via Pix abaixo — vai nos ajudar a realizar nossos próximos sonhos juntos.
          </p>
        </div>

        {/* QR Code Pix */}
        <div className="rounded-2xl bg-card shadow-petal p-6 border border-border inline-block mx-auto">
          <p className="font-display text-lg text-foreground mb-4">Pix para presentes</p>
          <img
            src={QR_URL}
            alt="QR Code Pix para presente"
            className="mx-auto rounded-lg border border-border"
            width={220}
            height={220}
          />
          <div className="mt-4 flex items-center gap-2 justify-center">
            <code className="text-xs bg-muted px-3 py-1.5 rounded-md text-foreground break-all">
              {PIX_KEY}
            </code>
            <Button size="icon" variant="outline" onClick={copy} className="border-rose-deep/30">
              {copied ? <Check className="h-4 w-4 text-rose-deep" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Atualize a chave Pix real no código quando definir.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionGifts;