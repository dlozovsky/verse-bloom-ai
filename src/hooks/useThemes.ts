import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useThemes = () => {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select(`
          id,
          name,
          description,
          poem_themes!inner(count)
        `)
        .order("name");

      if (error) throw error;
      
      // Transform data to include poem count
      return data?.map(theme => ({
        ...theme,
        poemCount: (theme.poem_themes as any)?.[0]?.count || 0
      })) || [];
    },
  });
};
