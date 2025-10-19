import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { loadPoetryData } from "@/utils/loadPoetryData";
import { Upload, CheckCircle2 } from "lucide-react";

const DataLoader = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    addedPoems: number;
    addedPoets: number;
    totalProcessed: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const result = await loadPoetryData(file);
      setResult(result);
      toast({
        title: "✅ Data Loaded Successfully",
        description: `Added ${result.addedPoems} poems and ${result.addedPoets} poets`,
      });
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Load Poetry Foundation Data
          </CardTitle>
          <CardDescription>
            Upload the archive.zip file containing Poetry Foundation poems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                asChild
                disabled={loading}
                className="w-full"
              >
                <span>
                  {loading ? "Processing..." : "Select ZIP File"}
                </span>
              </Button>
            </label>
          </div>

          {loading && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Processing poems... This may take a few minutes.
              </p>
            </div>
          )}

          {result && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Import Complete</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Total processed: {result.totalProcessed} poems</li>
                      <li>New poems added: {result.addedPoems}</li>
                      <li>New poets added: {result.addedPoets}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataLoader;
