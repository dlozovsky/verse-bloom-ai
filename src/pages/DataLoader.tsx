import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { loadPoetryData } from "@/utils/loadPoetryData";
import { Upload, CheckCircle2 } from "lucide-react";

const DataLoader = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    totalProcessed: number;
    addedPoems: number;
    addedPoets: number;
    skippedPoems: number;
    currentPoem: string;
  } | null>(null);
  const [result, setResult] = useState<{
    addedPoems: number;
    addedPoets: number;
    skippedPoems: number;
    totalProcessed: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setProgress(null);

    try {
      const result = await loadPoetryData(file, (progressUpdate) => {
        setProgress(progressUpdate);
      });
      setResult(result);
      setProgress(null);
      toast({
        title: "✅ Data Loaded Successfully",
        description: `Added ${result.addedPoems} poems, ${result.addedPoets} poets. Skipped ${result.skippedPoems} duplicates.`,
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

          {loading && progress && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress.totalProcessed} processed</span>
                </div>
                <Progress value={undefined} className="w-full" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-600">{progress.addedPoems}</p>
                  <p className="text-xs text-muted-foreground">Poems Added</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-600">{progress.addedPoets}</p>
                  <p className="text-xs text-muted-foreground">Poets Added</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-orange-600">{progress.skippedPoems}</p>
                  <p className="text-xs text-muted-foreground">Duplicates Skipped</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground text-center truncate">
                Current: {progress.currentPoem}
              </p>
            </div>
          )}

          {loading && !progress && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Initializing... This may take a few minutes.
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
                      <li>Duplicates skipped: {result.skippedPoems}</li>
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
