import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoemOfTheDay = () => {
  return useQuery({
    queryKey: ["poem-of-the-day", new Date().toISOString().split("T")[0]],
    queryFn: async () => {
      // Use the current date as a seed for deterministic daily selection
      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

      const { count, error: countError } = await supabase
        .from("poems")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      if (!count || count === 0) return null;

      const offset = seed % count;

      const { data, error } = await supabase
        .from("poems")
        .select(`
          *,
          poets(name, id),
          poem_themes(themes(name))
        `)
        .range(offset, offset)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
