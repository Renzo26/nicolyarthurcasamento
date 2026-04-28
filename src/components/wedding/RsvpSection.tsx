import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Search, Check, X, Loader2, Users } from "lucide-react";

interface Convidado {
  id: string;
  nome: string;
  confirmado: boolean;
  familia_id: string;
}

interface FamiliaResult {
  id: string;
  nome_lider: string;
  convidados: Convidado[];
}

const RsvpSection = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["rsvp-search", query],
    enabled: query.trim().length >= 2,
    queryFn: async () => {
      const term = query.trim();
      // Buscar em paralelo: por nome do líder da família e por nome do convidado
      const [byGuest, byLider] = await Promise.all([
        supabase.from("convidados").select("familia_id").ilike("nome", `%${term}%`),
        supabase.from("familias").select("id").ilike("nome_lider", `%${term}%`),
      ]);
      if (byGuest.error) throw byGuest.error;
      if (byLider.error) throw byLider.error;

      const familyIds = Array.from(
        new Set([
          ...(byGuest.data ?? []).map((m) => m.familia_id),
          ...(byLider.data ?? []).map((m) => m.id),
        ]),
      );
      if (familyIds.length === 0) return [] as FamiliaResult[];

      const { data: famData, error: famErr } = await supabase
        .from("familias")
        .select("id, nome_lider, convidados(id, nome, confirmado, familia_id)")
        .in("id", familyIds)
        .order("nome_lider");
      if (famErr) throw famErr;
      return (famData ?? []) as unknown as FamiliaResult[];
    },
  });

  const selectedFamily =
    results.find((f) => f.id === selectedFamilyId) ?? (results.length === 1 ? results[0] : null);

  const updateGuest = useMutation({
    mutationFn: async ({ id, confirmado }: { id: string; confirmado: boolean }) => {
      const { error } = await supabase.from("convidados").update({ confirmado }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-search"] });
    },
    onError: () => toast.error("Não foi possível atualizar agora."),
  });

  const confirmAll = useMutation({
    mutationFn: async (familiaId: string) => {
      const { error } = await supabase
        .from("convidados")
        .update({ confirmado: true })
        .eq("familia_id", familiaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Presença de toda a família confirmada! 💛");
      queryClient.invalidateQueries({ queryKey: ["rsvp-search"] });
    },
    onError: () => toast.error("Erro ao confirmar."),
  });

  const cancelAll = useMutation({
    mutationFn: async (familiaId: string) => {
      const { error } = await supabase
        .from("convidados")
        .update({ confirmado: false })
        .eq("familia_id", familiaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast("Presença cancelada para a família.");
      queryClient.invalidateQueries({ queryKey: ["rsvp-search"] });
    },
    onError: () => toast.error("Erro ao cancelar."),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedFamilyId(null);
    setQuery(search);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="font-script text-5xl" style={{ color: "hsl(var(--wedding-rose))" }}>
          Confirme sua presença
        </p>
        <p className="font-body text-sm opacity-70 max-w-md mx-auto">
          Digite o nome do responsável pela família ou de qualquer convidado para encontrar seu convite.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-12 bg-white/60 border-[hsl(var(--wedding-gold))]/40"
          />
        </div>
        <Button
          type="submit"
          disabled={search.trim().length < 2}
          className="h-12 px-6"
          style={{ background: "hsl(var(--wedding-rose))", color: "white" }}
        >
          Buscar
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-8 opacity-60">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-8 opacity-70 font-body text-sm">
          Nenhum convite encontrado com esse nome.
        </div>
      )}

      {!isLoading && results.length > 1 && !selectedFamilyId && (
        <div className="space-y-2">
          <p className="font-body text-sm opacity-70 text-center">
            Encontramos mais de uma família. Selecione a sua:
          </p>
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFamilyId(f.id)}
              className="w-full text-left rounded-lg border bg-white/60 p-4 hover:bg-white transition-colors"
              style={{ borderColor: "hsl(var(--wedding-gold) / 0.4)" }}
            >
              <div className="font-display text-lg">{f.nome_lider}</div>
              <div className="text-xs opacity-60 font-body flex items-center gap-1.5">
                <Users className="h-3 w-3" />
                {f.convidados.length} {f.convidados.length === 1 ? "pessoa" : "pessoas"}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedFamily && (
        <div
          className="rounded-xl border bg-white/70 p-6 space-y-5 shadow-sm"
          style={{ borderColor: "hsl(var(--wedding-gold) / 0.4)" }}
        >
          <div className="text-center">
            <p className="font-body text-xs uppercase tracking-[0.25em] opacity-60">
              Família
            </p>
            <p className="font-display text-2xl mt-1">{selectedFamily.nome_lider}</p>
          </div>

          <ul className="space-y-2">
            {selectedFamily.convidados.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
                style={{ borderColor: "hsl(var(--wedding-gold) / 0.25)" }}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={c.confirmado}
                    onCheckedChange={(checked) =>
                      updateGuest.mutate({ id: c.id, confirmado: !!checked })
                    }
                  />
                  <span className="font-body">{c.nome}</span>
                </div>
                {c.confirmado ? (
                  <span
                    className="text-xs font-body flex items-center gap-1"
                    style={{ color: "hsl(var(--wedding-sage))" }}
                  >
                    <Check className="h-3 w-3" /> Confirmado
                  </span>
                ) : (
                  <span className="text-xs font-body opacity-50">Pendente</span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={() => confirmAll.mutate(selectedFamily.id)}
              disabled={confirmAll.isPending}
              className="flex-1 h-11"
              style={{ background: "hsl(var(--wedding-rose))", color: "white" }}
            >
              <Check className="h-4 w-4 mr-1" />
              Confirmar todos
            </Button>
            <Button
              onClick={() => cancelAll.mutate(selectedFamily.id)}
              disabled={cancelAll.isPending}
              variant="outline"
              className="flex-1 h-11"
              style={{ borderColor: "hsl(var(--wedding-rose))", color: "hsl(var(--wedding-rose))" }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar presença
            </Button>
          </div>

          {results.length > 1 && (
            <button
              onClick={() => setSelectedFamilyId(null)}
              className="w-full text-xs opacity-60 hover:opacity-100 font-body"
            >
              ← escolher outra família
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RsvpSection;