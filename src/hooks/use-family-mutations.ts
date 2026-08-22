import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FamilyUpdate {
  nome_lider: string;
  telefone: string | null;
}

/**
 * Atualiza o nome do líder e/ou o telefone da família. Usado tanto na lista
 * quanto dentro da família, por isso vive aqui e não no componente.
 */
export const useUpdateFamily = (onUpdated?: (familia: FamilyUpdate) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      nome,
      telefone,
    }: {
      id: string;
      nome: string;
      telefone?: string;
    }) => {
      const nomeLimpo = nome.trim();
      const telefoneLimpo = telefone?.trim() || null;
      const { error } = await supabase
        .from("familias")
        .update({ nome_lider: nomeLimpo, telefone: telefoneLimpo })
        .eq("id", id);
      if (error) throw error;
      return { nome_lider: nomeLimpo, telefone: telefoneLimpo };
    },
    onSuccess: (familia) => {
      queryClient.invalidateQueries({ queryKey: ["familias"] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-familias"] });
      toast.success("Família atualizada!");
      onUpdated?.(familia);
    },
    onError: () => toast.error("Erro ao atualizar a família."),
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
