import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AISearchParams {
  query: string;
  type: 'poem' | 'poet';
}

export const useAISearch = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ query, type }: AISearchParams) => {
      const { data, error } = await supabase.functions.invoke('ai-poem-search', {
        body: { query, type }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.found && data.source === 'ai' && data.added) {
        toast({
          title: "✨ New Discovery!",
          description: `We found this ${data.results[0].title ? 'poem' : 'poet'} and added it to our collection using AI.`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Search Error",
        description: error.message || "Failed to search. Please try again.",
        variant: "destructive",
      });
    },
  });
};
