import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoemDetail = (poemId: string | undefined) => {
  return useQuery({
    queryKey: ["poem", poemId],
    queryFn: async () => {
      if (!poemId) throw new Error("Poem ID is required");

      const { data, error } = await supabase
        .from("poems")
        .select(`
          *,
          poets(id, name, bio, birth_year, death_year),
          poem_themes(
            themes(name)
          )
        `)
        .eq("id", poemId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!poemId,
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (poemId: string) => {
      const { error } = await supabase.rpc("increment_poem_views", {
        poem_uuid: poemId,
      });

      if (error) throw error;
    },
    onSuccess: (_, poemId) => {
      // Invalidate the poem query to refresh the view count
      queryClient.invalidateQueries({ queryKey: ["poem", poemId] });
    },
  });
};

export const useRelatedPoems = (poetId: string | undefined, currentPoemId: string | undefined) => {
  return useQuery({
    queryKey: ["related-poems", poetId, currentPoemId],
    queryFn: async () => {
      if (!poetId) return [];

      const { data, error } = await supabase
        .from("poems")
        .select(`
          id,
          title,
          poets(name)
        `)
        .eq("poet_id", poetId)
        .neq("id", currentPoemId || "")
        .limit(2);

      if (error) throw error;
      return data;
    },
    enabled: !!poetId,
  });
};
