import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, UserPlus } from "lucide-react";

interface GuestManagerProps {
  familiaId: string;
  nomeLider: string;
  onBack: () => void;
}

const GuestManager = ({ familiaId, nomeLider, onBack }: GuestManagerProps) => {
  const [novoNome, setNovoNome] = useState("");
  const queryClient = useQueryClient();

  const { data: convidados = [], isLoading } = useQuery({
    queryKey: ["convidados", familiaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("convidados")
        .select("*")
        .eq("familia_id", familiaId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addGuest = useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase
        .from("convidados")
        .insert({ familia_id: familiaId, nome: nome.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["convidados", familiaId] });
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      setNovoNome("");
      toast.success("Convidado adicionado!");
    },
    onError: () => toast.error("Erro ao adicionar convidado."),
  });

  const removeGuest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("convidados").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["convidados", familiaId] });
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      toast.success("Convidado removido.");
    },
    onError: () => toast.error("Erro ao remover convidado."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoNome.trim()) addGuest.mutate(novoNome);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Família {nomeLider}</h2>
          <p className="text-sm text-muted-foreground">
            {convidados.length} {convidados.length === 1 ? "convidado" : "convidados"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Nome do convidado"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <Button type="submit" disabled={!novoNome.trim() || addGuest.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : convidados.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <UserPlus className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p>Nenhum convidado ainda.</p>
          <p className="text-sm">Adicione o primeiro convidado acima.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {convidados.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3"
            >
              <span className="text-card-foreground">{c.nome}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeGuest.mutate(c.id)}
                disabled={removeGuest.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button variant="secondary" className="w-full" onClick={onBack}>
        Concluir
      </Button>
    </div>
  );
};

export default GuestManager;
