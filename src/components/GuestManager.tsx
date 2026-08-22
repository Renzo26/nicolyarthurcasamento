import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Check, Pencil, Phone, Plus, Trash2, UserPlus, X } from "lucide-react";
import { FamilyUpdate, useUpdateFamily, useRenameGuest } from "@/hooks/use-family-mutations";

interface GuestManagerProps {
  familiaId: string;
  nomeLider: string;
  telefone: string | null;
  onBack: () => void;
  onUpdated: (familia: FamilyUpdate) => void;
}

const GuestManager = ({ familiaId, nomeLider, telefone, onBack, onUpdated }: GuestManagerProps) => {
  const [novoNome, setNovoNome] = useState("");
  const [editandoFamilia, setEditandoFamilia] = useState(false);
  const [nomeFamiliaDraft, setNomeFamiliaDraft] = useState(nomeLider);
  const [telefoneFamiliaDraft, setTelefoneFamiliaDraft] = useState(telefone ?? "");
  const [editandoConvidadoId, setEditandoConvidadoId] = useState<string | null>(null);
  const [nomeConvidadoDraft, setNomeConvidadoDraft] = useState("");
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

  const updateFamily = useUpdateFamily((familia) => {
    setEditandoFamilia(false);
    onUpdated(familia);
  });

  const renameGuest = useRenameGuest(familiaId);

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
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
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
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      toast.success("Convidado removido.");
    },
    onError: () => toast.error("Erro ao remover convidado."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoNome.trim()) addGuest.mutate(novoNome);
  };

  const startEditFamilia = () => {
    setNomeFamiliaDraft(nomeLider);
    setTelefoneFamiliaDraft(telefone ?? "");
    setEditandoFamilia(true);
  };

  const handleRenameFamilia = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeFamiliaDraft.trim())
      updateFamily.mutate({
        id: familiaId,
        nome: nomeFamiliaDraft,
        telefone: telefoneFamiliaDraft,
      });
  };

  const startEditConvidado = (id: string, nome: string) => {
    setEditandoConvidadoId(id);
    setNomeConvidadoDraft(nome);
  };

  const handleRenameConvidado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoConvidadoId || !nomeConvidadoDraft.trim()) return;
    renameGuest.mutate(
      { id: editandoConvidadoId, nome: nomeConvidadoDraft },
      { onSuccess: () => setEditandoConvidadoId(null) },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          {editandoFamilia ? (
            <form onSubmit={handleRenameFamilia} className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={nomeFamiliaDraft}
                  onChange={(e) => setNomeFamiliaDraft(e.target.value)}
                  placeholder="Nome da família"
                  aria-label="Nome da família"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!nomeFamiliaDraft.trim() || updateFamily.isPending}
                  aria-label="Salvar dados da família"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditandoFamilia(false)}
                  aria-label="Cancelar edição"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={telefoneFamiliaDraft}
                onChange={(e) => setTelefoneFamiliaDraft(e.target.value)}
                placeholder="Telefone (opcional)"
                aria-label="Telefone da família"
                type="tel"
              />
            </form>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <h2 className="truncate text-xl font-bold text-foreground">Família {nomeLider}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startEditFamilia}
                  aria-label="Editar nome e telefone da família"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {convidados.length} {convidados.length === 1 ? "convidado" : "convidados"}
              </p>
              {telefone && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {telefone}
                </p>
              )}
            </>
          )}
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
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-4 py-3"
            >
              {editandoConvidadoId === c.id ? (
                <form onSubmit={handleRenameConvidado} className="flex flex-1 items-center gap-2">
                  <Input
                    value={nomeConvidadoDraft}
                    onChange={(e) => setNomeConvidadoDraft(e.target.value)}
                    aria-label={`Nome de ${c.nome}`}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!nomeConvidadoDraft.trim() || renameGuest.isPending}
                    aria-label="Salvar nome"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditandoConvidadoId(null)}
                    aria-label="Cancelar edição"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <>
                  <span className="truncate text-card-foreground">{c.nome}</span>
                  <div className="flex shrink-0 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => startEditConvidado(c.id, c.nome)}
                      aria-label={`Editar nome de ${c.nome}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeGuest.mutate(c.id)}
                      disabled={removeGuest.isPending}
                      aria-label={`Remover ${c.nome}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
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
