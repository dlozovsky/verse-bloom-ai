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
          poem_themes(count)
        `)
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};
