import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoetAnalytics = (poetId: string) => {
  return useQuery({
    queryKey: ["poet-analytics", poetId],
    queryFn: async () => {
      // Get all poems by poet with their stats
      const { data: poems, error: poemsError } = await supabase
        .from("poems")
        .select(`
          id,
          title,
          views,
          favorites,
          created_at
        `)
        .eq("poet_id", poetId)
        .order("created_at", { ascending: false });

      if (poemsError) throw poemsError;

      // Get comment counts for each poem
      const poemIds = poems?.map(p => p.id) || [];
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("poem_id")
        .in("poem_id", poemIds);

      if (commentsError) throw commentsError;

      // Calculate stats
      const totalViews = poems?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const totalFavorites = poems?.reduce((sum, p) => sum + (p.favorites || 0), 0) || 0;
      const totalComments = comments?.length || 0;
      
      const commentsByPoem = comments?.reduce((acc, c) => {
        acc[c.poem_id] = (acc[c.poem_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const poemsWithStats = poems?.map(poem => ({
        ...poem,
        commentCount: commentsByPoem[poem.id] || 0,
      }));

      return {
        totalPoems: poems?.length || 0,
        totalViews,
        totalFavorites,
        totalComments,
        poems: poemsWithStats,
        averageViews: poems?.length ? Math.round(totalViews / poems.length) : 0,
        averageFavorites: poems?.length ? Math.round(totalFavorites / poems.length) : 0,
      };
    },
    enabled: !!poetId,
  });
};
