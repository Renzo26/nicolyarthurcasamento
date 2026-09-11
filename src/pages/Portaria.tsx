import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isToday } from "date-fns";
import {
  Armchair,
  Check,
  CheckCircle2,
  Loader2,
  QrCode,
  RotateCcw,
  ScanLine,
  TriangleAlert,
  Undo2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import QrReader from "@/components/QrReader";

interface Convidado {
  id: string;
  nome: string;
  confirmado: boolean;
}

interface FamiliaPortaria {
  id: string;
  nome_lider: string;
  numero_mesa: string | null;
  checkin_em: string | null;
  convidados: Convidado[];
}

const GOLD = "hsl(var(--wedding-gold))";
const GOLD_LINE = "hsl(var(--wedding-gold) / 0.4)";
const CARD_BG = "hsl(var(--wedding-night-soft) / 0.85)";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** O QR da família carrega o id dela — sozinho ou dentro de um link. */
const extractFamiliaId = (data: string) => data.match(UUID_RE)?.[0].toLowerCase() ?? null;

/** "às 20:15" no dia da festa; com data se o registro for de outro dia (testes). */
const formatHorario = (iso: string) => {
  const d = new Date(iso);
  return isToday(d) ? `às ${format(d, "HH:mm")}` : `em ${format(d, "dd/MM 'às' HH:mm")}`;
};

const Portaria = () => {
  const [familiaId, setFamiliaId] = useState<string | null>(null);
  const [qrInvalido, setQrInvalido] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  // Diferencia "acabei de registrar" (verde) de "já tinha entrado" (alerta de
  // QR repassado ou lido duas vezes).
  const [registradoAgora, setRegistradoAgora] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const lendo = !familiaId && !qrInvalido && !cameraError;

  const handleScan = useCallback((data: string) => {
    navigator.vibrate?.(80);
    const id = extractFamiliaId(data);
    if (id) setFamiliaId(id);
    else setQrInvalido(true);
  }, []);

  const lerProximo = () => {
    setFamiliaId(null);
    setQrInvalido(false);
    setRegistradoAgora(null);
  };

  const { data: stats } = useQuery({
    queryKey: ["portaria-stats"],
    // Mais de um celular na portaria: o placar se atualiza sozinho.
    refetchInterval: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("familias").select("checkin_em");
      if (error) throw error;
      return { total: data.length, entraram: data.filter((f) => f.checkin_em).length };
    },
  });

  const {
    data: familia,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["portaria-familia", familiaId],
    enabled: !!familiaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familias")
        .select("id, nome_lider, numero_mesa, checkin_em, convidados(id, nome, confirmado)")
        .eq("id", familiaId!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as FamiliaPortaria | null;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["portaria-familia", familiaId] });
    queryClient.invalidateQueries({ queryKey: ["portaria-stats"] });
  };

  const registrarEntrada = useMutation({
    mutationFn: async (id: string) => {
      // O filtro `is null` impede que dois celulares registrem a mesma família:
      // o segundo não atualiza nada e cai no aviso de "já entrou".
      const { data, error } = await supabase
        .from("familias")
        .update({ checkin_em: new Date().toISOString() })
        .eq("id", id)
        .is("checkin_em", null)
        .select("id");
      if (error) throw error;
      return { id, registrou: data.length > 0 };
    },
    onSuccess: ({ id, registrou }) => {
      if (registrou) {
        setRegistradoAgora(id);
        toast.success("Entrada registrada!");
      } else {
        toast.warning("Essa família já tinha entrado.");
      }
      invalidate();
    },
    onError: () => toast.error("Não foi possível registrar a entrada."),
  });

  const desfazerEntrada = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("familias").update({ checkin_em: null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setRegistradoAgora(null);
      toast("Entrada desfeita.");
      invalidate();
    },
    onError: () => toast.error("Não foi possível desfazer."),
  });

  const confirmados = familia?.convidados.filter((c) => c.confirmado).length ?? 0;

  return (
    <main
      className="min-h-dvh"
      style={{ background: "hsl(var(--wedding-night))", color: "hsl(var(--wedding-cream))" }}
    >
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-6">
        {/* Cabeçalho com placar de entradas */}
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Portaria
            </p>
            <h1 className="mt-1 font-display text-2xl">Arthur &amp; Nicoly</h1>
          </div>
          {stats && (
            <div className="text-right">
              <p className="font-display text-3xl leading-none">
                {stats.entraram}
                <span className="text-lg opacity-50">/{stats.total}</span>
              </p>
              <p className="mt-1 font-body text-xs opacity-60">famílias entraram</p>
            </div>
          )}
        </header>

        {/* Câmera */}
        {lendo && (
          <section className="space-y-4">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black"
              style={{ border: `1px solid ${GOLD_LINE}` }}
            >
              <QrReader onScan={handleScan} onError={setCameraError} />
              {/* Mira: cantos dourados no centro do vídeo */}
              <div className="pointer-events-none absolute inset-[18%]">
                {[
                  "left-0 top-0 border-l-2 border-t-2 rounded-tl-lg",
                  "right-0 top-0 border-r-2 border-t-2 rounded-tr-lg",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`absolute h-10 w-10 ${pos}`}
                    style={{ borderColor: GOLD }}
                  />
                ))}
              </div>
            </div>
            <p className="flex items-center justify-center gap-2 text-center font-body text-sm opacity-75">
              <ScanLine className="h-4 w-4" style={{ color: GOLD }} />
              Aponte a câmera para o QR code do convite
            </p>
          </section>
        )}

        {cameraError && (
          <Aviso
            icon={TriangleAlert}
            titulo="Câmera indisponível"
            texto={cameraError}
            acao={
              <BotaoContorno onClick={() => setCameraError(null)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Tentar de novo
              </BotaoContorno>
            }
          />
        )}

        {qrInvalido && (
          <Aviso
            icon={QrCode}
            titulo="QR code não reconhecido"
            texto="Esse QR não é de um convite do casamento."
            acao={<BotaoContorno onClick={lerProximo}>Ler outro QR</BotaoContorno>}
          />
        )}

        {familiaId && isLoading && (
          <div className="flex justify-center py-16 opacity-70">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {familiaId && isError && (
          <Aviso
            icon={TriangleAlert}
            titulo="Erro ao buscar o convite"
            texto="Confira a internet do celular e tente de novo."
            acao={
              <div className="flex flex-col gap-2">
                <BotaoContorno onClick={() => refetch()}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Tentar de novo
                </BotaoContorno>
                <BotaoContorno onClick={lerProximo}>Ler outro QR</BotaoContorno>
              </div>
            }
          />
        )}

        {familiaId && !isLoading && !isError && !familia && (
          <Aviso
            icon={TriangleAlert}
            titulo="Convite não encontrado"
            texto="Esse QR não corresponde a nenhuma família da lista."
            acao={<BotaoContorno onClick={lerProximo}>Ler outro QR</BotaoContorno>}
          />
        )}

        {/* Resultado */}
        {familia && (
          <section
            className="space-y-6 rounded-2xl p-6"
            style={{ border: `1px solid ${GOLD_LINE}`, background: CARD_BG }}
          >
            {familia.checkin_em &&
              (registradoAgora === familia.id ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 font-body text-sm text-emerald-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Entrada registrada {formatHorario(familia.checkin_em)}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/15 px-4 py-3 font-body text-sm text-amber-100">
                  <TriangleAlert className="h-5 w-5 shrink-0" />
                  Atenção: essa família já entrou {formatHorario(familia.checkin_em)}
                </div>
              ))}

            <div className="text-center">
              <p className="font-body text-xs uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Família
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight">{familia.nome_lider}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Numero
                icon={Users}
                valor={familia.convidados.length}
                rotulo={familia.convidados.length === 1 ? "convidado" : "convidados"}
              />
              <Numero icon={Armchair} valor={familia.numero_mesa ?? "—"} rotulo="mesa" />
            </div>

            {familia.convidados.length > 0 && (
              <div className="space-y-2">
                <p className="text-center font-body text-xs opacity-60">
                  {confirmados} de {familia.convidados.length} confirmaram presença no site
                </p>
                <ul className="space-y-1.5">
                  {familia.convidados.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between rounded-lg px-4 py-2 font-body text-sm"
                      style={{ background: "hsl(var(--wedding-night) / 0.6)" }}
                    >
                      <span>{c.nome}</span>
                      {c.confirmado && <Check className="h-4 w-4" style={{ color: GOLD }} />}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!familia.checkin_em && (
                <Button
                  onClick={() => registrarEntrada.mutate(familia.id)}
                  disabled={registrarEntrada.isPending}
                  className="h-14 rounded-xl font-display text-sm font-semibold uppercase tracking-[0.22em] hover:opacity-90"
                  style={{
                    background: "linear-gradient(180deg, hsl(42 52% 82%) 0%, hsl(38 40% 62%) 100%)",
                    color: "hsl(26 35% 14%)",
                  }}
                >
                  {registrarEntrada.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-5 w-5" />
                  )}
                  Confirmar entrada
                </Button>
              )}
              <BotaoContorno onClick={lerProximo}>
                <ScanLine className="mr-2 h-4 w-4" />
                Ler próximo QR
              </BotaoContorno>
              {familia.checkin_em && (
                <button
                  type="button"
                  onClick={() => desfazerEntrada.mutate(familia.id)}
                  disabled={desfazerEntrada.isPending}
                  className="mt-1 flex items-center justify-center gap-1.5 font-body text-xs opacity-60 hover:opacity-100 disabled:opacity-30"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Desfazer entrada (registrada por engano)
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

/** Bloco de número grande: quantidade de convidados e mesa. */
const Numero = ({
  icon: Icon,
  valor,
  rotulo,
}: {
  icon: typeof Users;
  valor: number | string;
  rotulo: string;
}) => (
  <div
    className="rounded-xl px-3 py-4 text-center"
    style={{ border: `1px solid ${GOLD_LINE}`, background: "hsl(var(--wedding-night) / 0.6)" }}
  >
    <Icon className="mx-auto h-5 w-5" style={{ color: GOLD }} />
    <p className="mt-2 break-words font-display text-5xl leading-none">{valor}</p>
    <p className="mt-2 font-body text-xs uppercase tracking-[0.2em] opacity-70">{rotulo}</p>
  </div>
);

const BotaoContorno = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="h-12 w-full rounded-xl bg-transparent font-body text-xs uppercase tracking-[0.2em] hover:bg-white/5 hover:text-[hsl(var(--wedding-cream))]"
    style={{ borderColor: GOLD_LINE, color: "hsl(var(--wedding-cream))" }}
  >
    {children}
  </Button>
);

const Aviso = ({
  icon: Icon,
  titulo,
  texto,
  acao,
}: {
  icon: typeof Users;
  titulo: string;
  texto: string;
  acao: React.ReactNode;
}) => (
  <section
    className="space-y-4 rounded-2xl p-6 text-center"
    style={{ border: `1px solid ${GOLD_LINE}`, background: CARD_BG }}
  >
    <Icon className="mx-auto h-10 w-10" style={{ color: GOLD }} />
    <div>
      <h2 className="font-display text-2xl">{titulo}</h2>
      <p className="mt-2 font-body text-sm opacity-75">{texto}</p>
    </div>
    {acao}
  </section>
);

export default Portaria;
