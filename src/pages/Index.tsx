import { useState } from "react";
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
import { Plus, PartyPopper } from "lucide-react";
import FamilyCard from "@/components/FamilyCard";
import GuestManager from "@/components/GuestManager";
import { Link } from "react-router-dom";

interface FamiliaWithCount {
  id: string;
  nome_lider: string;
  total: number;
}

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeLider, setNomeLider] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<{ id: string; nome_lider: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: familias = [], isLoading } = useQuery({
    queryKey: ["familias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familias")
        .select("id, nome_lider, convidados(id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((f) => ({
        id: f.id,
        nome_lider: f.nome_lider,
        total: (f.convidados as unknown as { id: string }[])?.length ?? 0,
      })) as FamiliaWithCount[];
    },
  });

  const createFamily = useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase
        .from("familias")
        .insert({ nome_lider: nome.trim() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      setDialogOpen(false);
      setNomeLider("");
      toast.success("Família criada!");
      setSelectedFamily({ id: data.id, nome_lider: data.nome_lider });
    },
    onError: () => toast.error("Erro ao criar família."),
  });

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeLider.trim()) createFamily.mutate(nomeLider);
  };

  if (selectedFamily) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-8">
          <GuestManager
            familiaId={selectedFamily.id}
            nomeLider={selectedFamily.nome_lider}
            onBack={() => setSelectedFamily(null)}
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
            <h1 className="text-2xl font-bold text-foreground">Convidados</h1>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova família
          </Button>
        </div>

        <Link
          to="/convite"
          className="block rounded-lg border border-primary/30 bg-accent/40 px-4 py-3 text-center text-sm text-foreground transition hover:bg-accent"
        >
          ✨ Ver site do casamento (/convite)
        </Link>

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
        ) : (
          <div className="space-y-3">
            {familias.map((f) => (
              <FamilyCard
                key={f.id}
                nomeLider={f.nome_lider}
                totalConvidados={f.total}
                onClick={() => setSelectedFamily({ id: f.id, nome_lider: f.nome_lider })}
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
            <div className="py-4">
              <Input
                placeholder="Nome do líder da família"
                value={nomeLider}
                onChange={(e) => setNomeLider(e.target.value)}
                autoFocus
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
    </div>
  );
};

export default Index;
