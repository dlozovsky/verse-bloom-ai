import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoets = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["poets", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("poets")
        .select(`
          id,
          name,
          bio,
          birth_year,
          death_year,
          nationality,
          poems(count)
        `)
        .order("name");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const usePoetDetail = (poetId: string | undefined) => {
  return useQuery({
    queryKey: ["poet", poetId],
    queryFn: async () => {
      if (!poetId) throw new Error("Poet ID is required");

      const { data, error } = await supabase
        .from("poets")
        .select(`
          *,
          poems(
            id,
            title,
            body,
            year_published,
            views,
            favorites,
            poem_themes(
              themes(name)
            )
          )
        `)
        .eq("id", poetId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!poetId,
  });
};
