import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Search, Check, X, Heart } from "lucide-react";

interface Convidado {
  id: string;
  nome: string;
  confirmado: boolean;
  familia_id: string;
}
interface FamiliaFull {
  id: string;
  nome_lider: string;
  convidados: Convidado[];
}

const RSVP = () => {
  const [query, setQuery] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  const { data: familias = [] } = useQuery({
    queryKey: ["rsvp-familias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familias")
        .select("id, nome_lider, convidados(id, nome, confirmado, familia_id)")
        .order("nome_lider");
      if (error) throw error;
      return (data ?? []) as unknown as FamiliaFull[];
    },
  });

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return familias.filter(
      (f) =>
        f.nome_lider.toLowerCase().includes(q) ||
        f.convidados.some((c) => c.nome.toLowerCase().includes(q)),
    );
  }, [query, familias]);

  const selectedFamily = familias.find((f) => f.id === selectedFamilyId);

  const updateMutation = useMutation({
    mutationFn: async ({ ids, confirmado }: { ids: string[]; confirmado: boolean }) => {
      const { error } = await supabase
        .from("convidados")
        .update({ confirmado })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      toast.success(vars.confirmado ? "Presença confirmada!" : "Presença cancelada.");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });

  const togglePerson = (c: Convidado) => {
    const next = !(pending[c.id] ?? c.confirmado);
    setPending((p) => ({ ...p, [c.id]: next }));
  };

  const isChecked = (c: Convidado) => pending[c.id] ?? c.confirmado;

  const confirmAll = () => {
    if (!selectedFamily) return;
    const ids = selectedFamily.convidados.map((c) => c.id);
    updateMutation.mutate({ ids, confirmado: true });
    setPending({});
  };

  const cancelAll = () => {
    if (!selectedFamily) return;
    const ids = selectedFamily.convidados.map((c) => c.id);
    updateMutation.mutate({ ids, confirmado: false });
    setPending({});
  };

  const saveSelection = () => {
    if (!selectedFamily) return;
    const toConfirm: string[] = [];
    const toCancel: string[] = [];
    selectedFamily.convidados.forEach((c) => {
      const desired = pending[c.id] ?? c.confirmado;
      if (desired !== c.confirmado) {
        if (desired) toConfirm.push(c.id);
        else toCancel.push(c.id);
      }
    });
    if (toConfirm.length === 0 && toCancel.length === 0) {
      toast("Nenhuma alteração.");
      return;
    }
    if (toConfirm.length) updateMutation.mutate({ ids: toConfirm, confirmado: true });
    if (toCancel.length) updateMutation.mutate({ ids: toCancel, confirmado: false });
    setPending({});
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-ivory px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="font-serif-display text-sm uppercase tracking-[0.4em] text-gold animate-fade-in opacity-0">
          R.S.V.P
        </p>
        <h2 className="mt-4 font-script text-5xl text-foreground sm:text-6xl animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          Confirme sua presença
        </h2>
        <div className="mx-auto my-8 h-px w-20 bg-gold/60" />

        {!selectedFamily ? (
          <>
            <div className="relative animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Digite seu nome ou da família"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 rounded-full border-gold/30 bg-white pl-12 text-center font-serif-display text-base shadow-soft"
              />
            </div>

            {query.trim().length >= 2 && (
              <div className="mt-4 max-h-72 overflow-y-auto rounded-2xl border border-gold/20 bg-white shadow-soft">
                {matches.length === 0 ? (
                  <p className="py-8 font-serif-display italic text-muted-foreground">
                    Nenhuma família encontrada
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {matches.map((f) => (
                      <li key={f.id}>
                        <button
                          onClick={() => setSelectedFamilyId(f.id)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-accent"
                        >
                          <div>
                            <p className="font-serif-display text-lg text-foreground">
                              Família {f.nome_lider}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {f.convidados.length} {f.convidados.length === 1 ? "convidado" : "convidados"}
                            </p>
                          </div>
                          <Heart className="h-4 w-4 text-gold" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-elegant animate-scale-in">
            <p className="font-serif-display text-xs uppercase tracking-[0.3em] text-gold">
              Família
            </p>
            <h3 className="mt-1 font-serif-display text-2xl text-foreground">
              {selectedFamily.nome_lider}
            </h3>

            {selectedFamily.convidados.length === 0 ? (
              <p className="my-8 font-serif-display italic text-muted-foreground">
                Nenhum convidado nesta família.
              </p>
            ) : (
              <ul className="my-6 space-y-2">
                {selectedFamily.convidados.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => togglePerson(c)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition ${
                      isChecked(c)
                        ? "border-gold/40 bg-accent/60"
                        : "border-border bg-secondary/40"
                    }`}
                  >
                    <span className="font-serif-display text-base text-foreground">{c.nome}</span>
                    <Checkbox
                      checked={isChecked(c)}
                      onCheckedChange={() => togglePerson(c)}
                    />
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2">
              <Button
                onClick={saveSelection}
                disabled={updateMutation.isPending || selectedFamily.convidados.length === 0}
                className="w-full rounded-full bg-gradient-gold py-6 font-serif-display text-sm uppercase tracking-[0.3em] text-white shadow-soft hover:opacity-90"
              >
                <Check className="mr-2 h-4 w-4" />
                Salvar seleção
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={confirmAll}
                  disabled={updateMutation.isPending || selectedFamily.convidados.length === 0}
                  className="rounded-full border-gold/40 font-serif-display text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-white"
                >
                  Confirmar todos
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelAll}
                  disabled={updateMutation.isPending || selectedFamily.convidados.length === 0}
                  className="rounded-full border-border font-serif-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:bg-secondary"
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancelar todos
                </Button>
              </div>
              <button
                onClick={() => {
                  setSelectedFamilyId(null);
                  setQuery("");
                  setPending({});
                }}
                className="mt-3 w-full text-center font-serif-display text-sm italic text-muted-foreground hover:text-foreground"
              >
                ← Buscar outro nome
              </button>
            </div>
          </div>
        )}

        <p className="mt-12 font-script text-3xl text-gold animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
          Mal podemos esperar por você
        </p>
      </div>
    </section>
  );
};

export default RSVP;