import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AnalysisAction = "analyze" | "themes" | "similar";

export const useAIAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzePoem = async (poem: any, action: AnalysisAction) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-poem", {
        body: { poem, action },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return null;
      }

      setResult(data.result);
      return data.result;
    } catch (error) {
      console.error("Error analyzing poem:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the poem. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzePoem,
    isLoading,
    result,
  };
};
