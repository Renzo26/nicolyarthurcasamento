import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Renomeia a família (nome do líder). Usado tanto na lista quanto dentro da
 * família, por isso vive aqui e não no componente.
 */
export const useRenameFamily = (onRenamed?: (nome: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const nomeLimpo = nome.trim();
      const { error } = await supabase
        .from("familias")
        .update({ nome_lider: nomeLimpo })
        .eq("id", id);
      if (error) throw error;
      return nomeLimpo;
    },
    onSuccess: (nomeLimpo) => {
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      toast.success("Nome da família atualizado!");
      onRenamed?.(nomeLimpo);
    },
    onError: () => toast.error("Erro ao renomear a família."),
  });
};

/** Corrige o nome de um convidado cadastrado errado. */
export const useRenameGuest = (familiaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const { error } = await supabase
        .from("convidados")
        .update({ nome: nome.trim() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["convidados", familiaId] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      toast.success("Nome do convidado atualizado!");
    },
    onError: () => toast.error("Erro ao renomear o convidado."),
  });
};
