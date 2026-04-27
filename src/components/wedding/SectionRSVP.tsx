import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Search, Heart, Check, X, Users } from "lucide-react";

interface Familia {
  id: string;
  nome_lider: string;
}
interface Convidado {
  id: string;
  nome: string;
  confirmado: boolean;
  observacao: string | null;
  familia_id: string;
}

const SectionRSVP = () => {
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<Familia | null>(null);
  const queryClient = useQueryClient();

  const { data: familias = [], isLoading: loadingFam } = useQuery({
    queryKey: ["rsvp-familias", busca],
    queryFn: async () => {
      if (!busca.trim()) return [] as Familia[];
      const term = `%${busca.trim()}%`;
      // Busca por nome do líder ou por convidado dentro da família
      const [{ data: byLider }, { data: byGuest }] = await Promise.all([
        supabase.from("familias").select("id, nome_lider").ilike("nome_lider", term).limit(20),
        supabase.from("convidados").select("familia_id, familias!inner(id, nome_lider)").ilike("nome", term).limit(20),
      ]);
      const map = new Map<string, Familia>();
      (byLider ?? []).forEach((f) => map.set(f.id, f));
      (byGuest ?? []).forEach((g: any) => {
        const f = g.familias;
        if (f) map.set(f.id, { id: f.id, nome_lider: f.nome_lider });
      });
      return Array.from(map.values());
    },
    enabled: busca.trim().length >= 2,
  });

  const { data: convidados = [], isLoading: loadingConv } = useQuery({
    queryKey: ["rsvp-convidados", selected?.id],
    queryFn: async () => {
      if (!selected) return [] as Convidado[];
      const { data, error } = await supabase
        .from("convidados")
        .select("id, nome, confirmado, observacao, familia_id")
        .eq("familia_id", selected.id)
        .order("nome");
      if (error) throw error;
      return data as Convidado[];
    },
    enabled: !!selected,
  });

  const setConfirm = useMutation({
    mutationFn: async ({ ids, value }: { ids: string[]; value: boolean }) => {
      const { error } = await supabase
        .from("convidados")
        .update({ confirmado: value })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-convidados", selected?.id] });
      toast.success(vars.value ? "Presença confirmada!" : "Presença cancelada.");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });

  const toggleOne = (c: Convidado) =>
    setConfirm.mutate({ ids: [c.id], value: !c.confirmado });

  const confirmAll = () => {
    if (!convidados.length) return;
    setConfirm.mutate({ ids: convidados.map((c) => c.id), value: true });
  };

  const cancelAll = () => {
    if (!convidados.length) return;
    setConfirm.mutate({ ids: convidados.map((c) => c.id), value: false });
  };

  return (
    <section
      id="rsvp"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-cream relative"
    >
      <div className="max-w-xl mx-auto w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <Heart className="h-7 w-7 mx-auto text-rose-deep fill-rose-deep" />
          <p className="font-script text-4xl text-rose-deep">Confirme sua presença</p>
          <div className="h-px w-16 bg-rose-deep/40 mx-auto" />
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Busque seu nome ou o nome do responsável da família para confirmar a presença de todos.
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setSelected(null);
            }}
            placeholder="Digite seu nome ou da família..."
            className="pl-9 bg-card border-rose-deep/20 h-12"
          />
        </div>

        {/* Lista de famílias encontradas */}
        {!selected && busca.trim().length >= 2 && (
          <div className="space-y-2">
            {loadingFam ? (
              <p className="text-center text-sm text-muted-foreground">Buscando...</p>
            ) : familias.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhum convidado encontrado. Tente outro nome.
              </p>
            ) : (
              familias.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className="w-full text-left rounded-xl bg-card border border-border hover:border-rose-deep/40 hover:shadow-soft transition-all p-4 flex items-center gap-3"
                >
                  <Users className="h-4 w-4 text-rose-deep" />
                  <span className="font-display text-lg text-foreground">{f.nome_lider}</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Família selecionada */}
        {selected && (
          <div className="rounded-2xl bg-card shadow-soft border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Família</p>
                <p className="font-display text-2xl text-foreground">{selected.nome_lider}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                Trocar
              </Button>
            </div>

            {loadingConv ? (
              <p className="text-sm text-muted-foreground text-center py-6">Carregando...</p>
            ) : convidados.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum convidado nesta família.
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {convidados.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 border border-border"
                    >
                      <Checkbox
                        checked={c.confirmado}
                        onCheckedChange={() => toggleOne(c)}
                        disabled={setConfirm.isPending}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{c.nome}</p>
                        {c.observacao && (
                          <p className="text-xs text-muted-foreground truncate">{c.observacao}</p>
                        )}
                      </div>
                      {c.confirmado ? (
                        <span className="text-xs bg-rose/20 text-rose-deep px-2 py-1 rounded-full font-medium">
                          Confirmado
                        </span>
                      ) : (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          Pendente
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <Button
                    onClick={confirmAll}
                    disabled={setConfirm.isPending}
                    className="bg-rose-deep hover:bg-rose-deep/90"
                  >
                    <Check className="h-4 w-4 mr-1" /> Confirmar todos
                  </Button>
                  <Button
                    onClick={cancelAll}
                    disabled={setConfirm.isPending}
                    variant="outline"
                    className="border-rose-deep/30"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancelar todos
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Você pode confirmar ou desmarcar individualmente clicando na caixa ao lado de cada nome.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionRSVP;