import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          poem_id,
          created_at,
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useIsFavorite = (poemId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-favorite", poemId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("poem_id", poemId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user,
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (poemId: string) => {
      if (!user) {
        throw new Error("You must be signed in to favorite poems");
      }

      // Check if already favorited
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("poem_id", poemId)
        .maybeSingle();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        return { action: "removed" };
      } else {
        // Add favorite
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, poem_id: poemId });

        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (data, poemId) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["is-favorite", poemId] });
      
      toast({
        title: data.action === "added" ? "Added to Favorites" : "Removed from Favorites",
        description: data.action === "added" 
          ? "This poem has been added to your favorites." 
          : "This poem has been removed from your favorites.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
