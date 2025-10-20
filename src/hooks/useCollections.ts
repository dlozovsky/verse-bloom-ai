import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCollections = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", userId],
    queryFn: async () => {
      let query = supabase
        .from("collections")
        .select(`
          *,
          collection_poems(count),
          profiles:user_id (
            display_name
          )
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      } else {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const createCollection = useMutation({
    mutationFn: async (collection: { name: string; description?: string; is_public: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("collections")
        .insert({ ...collection, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast({ title: "Collection created successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create collection", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (collectionId: string) => {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast({ title: "Collection deleted" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete collection", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const addPoemToCollection = useMutation({
    mutationFn: async ({ collectionId, poemId }: { collectionId: string; poemId: string }) => {
      const { error } = await supabase
        .from("collection_poems")
        .insert({ collection_id: collectionId, poem_id: poemId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection-poems"] });
      toast({ title: "Poem added to collection" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add poem", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const removePoemFromCollection = useMutation({
    mutationFn: async ({ collectionId, poemId }: { collectionId: string; poemId: string }) => {
      const { error } = await supabase
        .from("collection_poems")
        .delete()
        .eq("collection_id", collectionId)
        .eq("poem_id", poemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection-poems"] });
      toast({ title: "Poem removed from collection" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to remove poem", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    collections,
    isLoading,
    createCollection,
    deleteCollection,
    addPoemToCollection,
    removePoemFromCollection,
  };
};

export const useCollectionPoems = (collectionId: string) => {
  return useQuery({
    queryKey: ["collection-poems", collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_poems")
        .select(`
          *,
          poems (
            *,
            poets (name)
          )
        `)
        .eq("collection_id", collectionId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
