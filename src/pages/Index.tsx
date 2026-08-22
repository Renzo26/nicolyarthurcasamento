import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, PartyPopper, Search } from "lucide-react";
import FamilyCard from "@/components/FamilyCard";
import GuestManager from "@/components/GuestManager";
import { useUpdateFamily } from "@/hooks/use-family-mutations";
import { bestScore, MATCH_THRESHOLD } from "@/lib/name-search";

interface FamiliaWithCount {
  id: string;
  nome_lider: string;
  telefone: string | null;
  total: number;
  nomes: string[];
}

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeLider, setNomeLider] = useState("");
  const [telefoneLider, setTelefoneLider] = useState("");
  const [editingFamily, setEditingFamily] = useState<{
    id: string;
    nome_lider: string;
    telefone: string | null;
  } | null>(null);
  const [novoNomeFamilia, setNovoNomeFamilia] = useState("");
  const [novoTelefoneFamilia, setNovoTelefoneFamilia] = useState("");
  const [busca, setBusca] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<{
    id: string;
    nome_lider: string;
    telefone: string | null;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: familias = [], isLoading } = useQuery({
    queryKey: ["familias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familias")
        .select("id, nome_lider, telefone, convidados(id, nome)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((f) => {
        const convidados = (f.convidados as unknown as { id: string; nome: string }[]) ?? [];
        return {
          id: f.id,
          nome_lider: f.nome_lider,
          telefone: f.telefone,
          total: convidados.length,
          nomes: convidados.map((c) => c.nome),
        };
      }) as FamiliaWithCount[];
    },
  });

  const totalConvidados = familias.reduce((acc, f) => acc + f.total, 0);

  // Mesma busca tolerante do convite: aqui serve para achar rápido a família
  // que precisa de correção, mesmo lembrando só o apelido.
  const familiasVisiveis = useMemo(() => {
    const term = busca.trim();
    if (term.length < 2) return familias;
    return familias
      .map((f) => ({ familia: f, score: bestScore(term, [f.nome_lider, ...f.nomes]) }))
      .filter((r) => r.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.familia);
  }, [familias, busca]);

  const updateFamily = useUpdateFamily((familia) => {
    setEditingFamily(null);
    setSelectedFamily((current) => (current ? { ...current, ...familia } : current));
  });

  const openEdit = (familia: { id: string; nome_lider: string; telefone: string | null }) => {
    setEditingFamily(familia);
    setNovoNomeFamilia(familia.nome_lider);
    setNovoTelefoneFamilia(familia.telefone ?? "");
  };

  const handleRenameFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFamily && novoNomeFamilia.trim()) {
      updateFamily.mutate({
        id: editingFamily.id,
        nome: novoNomeFamilia,
        telefone: novoTelefoneFamilia,
      });
    }
  };

  const createFamily = useMutation({
    mutationFn: async ({ nome, telefone }: { nome: string; telefone: string }) => {
      const { data, error } = await supabase
        .from("familias")
        .insert({ nome_lider: nome.trim(), telefone: telefone.trim() || null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      setDialogOpen(false);
      setNomeLider("");
      setTelefoneLider("");
      toast.success("Família criada!");
      setSelectedFamily({ id: data.id, nome_lider: data.nome_lider, telefone: data.telefone });
    },
    onError: () => toast.error("Erro ao criar família."),
  });

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeLider.trim()) createFamily.mutate({ nome: nomeLider, telefone: telefoneLider });
  };

  if (selectedFamily) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-8">
          <GuestManager
            familiaId={selectedFamily.id}
            nomeLider={selectedFamily.nome_lider}
            telefone={selectedFamily.telefone}
            onBack={() => setSelectedFamily(null)}
            onUpdated={(familia) =>
              setSelectedFamily((current) => (current ? { ...current, ...familia } : current))
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Convidados</h1>
              {!isLoading && (
                <p className="text-sm text-muted-foreground">
                  {familias.length} {familias.length === 1 ? "família" : "famílias"} ·{" "}
                  {totalConvidados} {totalConvidados === 1 ? "convidado" : "convidados"}
                </p>
              )}
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova família
          </Button>
        </div>

        {/* Busca tolerante: acha por apelido, acento ou nome de qualquer membro */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar família ou convidado..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : familias.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <PartyPopper className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Nenhuma família cadastrada</p>
            <p className="text-sm mt-1">Comece adicionando a primeira família.</p>
          </div>
        ) : familiasVisiveis.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Nenhuma família encontrada</p>
            <p className="text-sm mt-1">Tente outro nome ou o sobrenome.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {familiasVisiveis.map((f) => (
              <FamilyCard
                key={f.id}
                nomeLider={f.nome_lider}
                telefone={f.telefone}
                totalConvidados={f.total}
                onClick={() =>
                  setSelectedFamily({ id: f.id, nome_lider: f.nome_lider, telefone: f.telefone })
                }
                onEdit={() => openEdit(f)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create family dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateFamily}>
            <DialogHeader>
              <DialogTitle>Nova família</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Input
                placeholder="Nome do líder da família"
                value={nomeLider}
                onChange={(e) => setNomeLider(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Telefone (opcional)"
                value={telefoneLider}
                onChange={(e) => setTelefoneLider(e.target.value)}
                type="tel"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!nomeLider.trim() || createFamily.isPending}>
                Criar e adicionar convidados
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename family dialog */}
      <Dialog open={!!editingFamily} onOpenChange={(open) => !open && setEditingFamily(null)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleRenameFamily}>
            <DialogHeader>
              <DialogTitle>Editar família</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Input
                placeholder="Nome do líder da família"
                value={novoNomeFamilia}
                onChange={(e) => setNovoNomeFamilia(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Telefone (opcional)"
                value={novoTelefoneFamilia}
                onChange={(e) => setNovoTelefoneFamilia(e.target.value)}
                type="tel"
              />
              <p className="text-xs text-muted-foreground">
                Dica: escrever o nome completo com o apelido — “Beatriz (Bia) Miron” — faz a busca
                encontrar o convite pelos dois. O telefone também pode ser usado na busca.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingFamily(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!novoNomeFamilia.trim() || updateFamily.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
