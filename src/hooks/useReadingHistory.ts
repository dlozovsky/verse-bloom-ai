import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useReadingHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reading-history", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("reading_history")
        .select(`
          id,
          read_at,
          poems (
            id,
            title,
            body,
            poet_id,
            poets(name),
            poem_themes(themes(name))
          )
        `)
        .eq("user_id", user.id)
        .order("read_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddToHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (poemId: string) => {
      if (!user) return;

      // Use upsert to handle duplicates gracefully
      const { error } = await supabase
        .from("reading_history")
        .upsert(
          { user_id: user.id, poem_id: poemId, read_at: new Date().toISOString() },
          { onConflict: "user_id,poem_id" }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-history"] });
    },
  });
};
