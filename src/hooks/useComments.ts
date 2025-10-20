import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useComments = (poemId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", poemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            display_name
          )
        `)
        .eq("poem_id", poemId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to comment");

      const { data, error } = await supabase
        .from("comments")
        .insert({ user_id: user.id, poem_id: poemId, content })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", poemId] });
      toast({ title: "Comment added successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", poemId] });
      toast({ title: "Comment deleted" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    comments,
    isLoading,
    addComment,
    deleteComment,
  };
};
