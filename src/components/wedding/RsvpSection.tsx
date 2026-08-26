import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MATCH_THRESHOLD, normalizePhone, phoneScore } from "@/lib/name-search";
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
  telefone: string | null;
  convidados: Convidado[];
}

const RsvpSection = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // A lista inteira vem de uma vez (é pequena) porque o casamento de nomes é
  // tolerante — apelido, acento e erro de digitação — e o `ilike` do Postgres
  // só acha substring exata: quem foi cadastrado como "Bia" nunca apareceria
  // numa busca por "Beatriz".
  const { data: familias = [], isLoading: isLoadingList } = useQuery({
    queryKey: ["rsvp-familias"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familias")
        .select("id, nome_lider, telefone, convidados(id, nome, confirmado, familia_id)")
        .order("nome_lider");
      if (error) throw error;
      return (data ?? []) as unknown as FamiliaResult[];
    },
  });

  const term = query.trim();
  const termDigits = normalizePhone(term);
  const isLoading = isLoadingList && termDigits.length >= 8;

  const results = useMemo(() => {
    if (termDigits.length < 8) return [] as FamiliaResult[];
    return familias
      .map((f) => ({ familia: f, score: phoneScore(termDigits, f.telefone ?? "") }))
      .filter((r) => r.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score || a.familia.nome_lider.localeCompare(b.familia.nome_lider))
      .slice(0, 8)
      .map((r) => r.familia);
  }, [familias, termDigits]);

  const selectedFamily =
    results.find((f) => f.id === selectedFamilyId) ?? (results.length === 1 ? results[0] : null);

  const updateGuest = useMutation({
    mutationFn: async ({ id, confirmado }: { id: string; confirmado: boolean }) => {
      const { error } = await supabase.from("convidados").update({ confirmado }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
    },
    onError: () => toast.error("Não foi possível atualizar agora."),
  });

  // Age só sobre quem está marcado — o rótulo do botão promete isso.
  const confirmSelected = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("convidados").update({ confirmado: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Presença confirmada! 💛");
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
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
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
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
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: "hsl(var(--wedding-gold))" }}
          />
          <Input
            placeholder="Buscar pelo telefone cadastrado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="tel"
            inputMode="numeric"
            className="h-16 rounded-xl pl-14 font-display text-lg text-[hsl(var(--wedding-cream))] placeholder:text-[hsl(var(--wedding-cream))]/45 focus-visible:ring-[hsl(var(--wedding-gold))]"
            style={{
              background: "hsl(var(--wedding-night) / 0.65)",
              borderColor: "hsl(var(--wedding-gold) / 0.45)",
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={normalizePhone(search).length < 8}
          className="h-16 rounded-xl px-10 font-display font-semibold text-sm uppercase tracking-[0.28em] transition-transform hover:scale-[1.02] hover:opacity-100"
          style={{
            background: "linear-gradient(180deg, hsl(42 52% 82%) 0%, hsl(38 40% 62%) 100%)",
            color: "hsl(26 35% 14%)",
            boxShadow: "0 8px 26px hsl(26 30% 4% / 0.5)",
          }}
        >
          Buscar
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-8 opacity-60">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && termDigits.length >= 8 && results.length === 0 && (
        <div className="text-center py-8 opacity-70 font-body text-sm">
          <p>Nenhum convite encontrado.</p>
          <p className="mt-1 text-xs">Confira o telefone cadastrado com quem organizou o convite.</p>
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
              className="w-full rounded-lg border p-4 text-left transition-colors hover:border-[hsl(var(--wedding-gold))]"
              style={{
                borderColor: "hsl(var(--wedding-gold) / 0.35)",
                background: "hsl(var(--wedding-night-soft) / 0.8)",
              }}
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
          className="space-y-5 rounded-2xl border p-6 lg:p-8"
          style={{
            borderColor: "hsl(var(--wedding-gold) / 0.4)",
            background: "hsl(var(--wedding-night-soft) / 0.8)",
          }}
        >
          <div className="text-center">
            <p
              className="font-body text-xs uppercase tracking-[0.3em]"
              style={{ color: "hsl(var(--wedding-gold))" }}
            >
              Família
            </p>
            <p className="mt-2 font-display text-2xl lg:text-3xl">{selectedFamily.nome_lider}</p>
          </div>

          <ul className="space-y-2">
            {selectedFamily.convidados.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
                style={{
                  borderColor: "hsl(var(--wedding-gold) / 0.22)",
                  background: "hsl(var(--wedding-night) / 0.5)",
                }}
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
              onClick={() =>
                confirmSelected.mutate(
                  selectedFamily.convidados.filter((c) => c.confirmado).map((c) => c.id),
                )
              }
              disabled={
                confirmSelected.isPending || !selectedFamily.convidados.some((c) => c.confirmado)
              }
              className="h-12 flex-1 font-body text-xs uppercase tracking-[0.2em] hover:opacity-90"
              style={{ background: "hsl(var(--wedding-gold))", color: "hsl(var(--wedding-night))" }}
            >
              <Check className="mr-1 h-4 w-4" />
              Confirmar pessoas selecionadas
            </Button>
            <Button
              onClick={() => cancelAll.mutate(selectedFamily.id)}
              disabled={cancelAll.isPending}
              variant="outline"
              className="h-12 flex-1 bg-transparent font-body text-xs uppercase tracking-[0.2em] hover:bg-white/5"
              style={{
                borderColor: "hsl(var(--wedding-gold) / 0.4)",
                color: "hsl(var(--wedding-cream))",
              }}
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