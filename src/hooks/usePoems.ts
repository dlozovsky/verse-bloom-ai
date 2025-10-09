import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Poem = {
  id: string;
  title: string;
  body: string;
  poet_id: string;
  year_published: number | null;
  views: number;
  favorites: number;
  poets: {
    name: string;
  };
  poem_themes: {
    themes: {
      name: string;
    };
  }[];
};

export const usePoems = (limit?: number, themeFilter?: string) => {
  return useQuery({
    queryKey: ["poems", limit, themeFilter],
    queryFn: async () => {
      let query = supabase
        .from("poems")
        .select(`
          *,
          poets(name),
          poem_themes(
            themes(name)
          )
        `)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by theme if provided
      if (themeFilter && data) {
        return data.filter((poem) =>
          poem.poem_themes.some(
            (pt: any) => pt.themes.name === themeFilter
          )
        );
      }

      return data as Poem[];
    },
  });
};

export const useFeaturedPoems = () => {
  return useQuery({
    queryKey: ["featured-poems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("poems")
        .select(`
          *,
          poets(name),
          poem_themes(
            themes(name)
          )
        `)
        .order("views", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Poem[];
    },
  });
};

export const useRandomPoem = () => {
  return useQuery({
    queryKey: ["random-poem", Math.random()], // Force refetch on component mount
    queryFn: async () => {
      // Get total count first
      const { count, error: countError } = await supabase
        .from("poems")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      if (!count || count === 0) return null;

      // Get random offset
      const randomOffset = Math.floor(Math.random() * count);

      const { data, error } = await supabase
        .from("poems")
        .select(`
          *,
          poets(name, id),
          poem_themes(
            themes(name)
          )
        `)
        .range(randomOffset, randomOffset)
        .single();

      if (error) throw error;
      return data as Poem & { poets: { name: string; id: string } };
    },
  });
};
