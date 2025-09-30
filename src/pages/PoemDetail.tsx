import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Share2, BookMarked, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Skeleton } from "@/components/ui/skeleton";

const PoemDetail = () => {
  const { id } = useParams();
  const { analyzePoem, isLoading, result } = useAIAnalysis();
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Mock data
  const poem = {
    title: "The Road Not Taken",
    poet: "Robert Frost",
    poetId: "1",
    year: 1916,
    body: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`,
    theme: "Life & Choices",
    views: 15420,
    favorites: 892,
  };

  const handleAnalyze = async () => {
    setShowAnalysis(true);
    await analyzePoem(poem, "analyze");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          {/* Poem header */}
          <div className="space-y-4">
            <span className="inline-block text-sm font-medium text-secondary bg-accent px-3 py-1 rounded">
              {poem.theme}
            </span>
            <h1 className="poem-title">{poem.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link to={`/poet/${poem.poetId}`} className="text-lg hover:text-primary transition-colors">
                by {poem.poet}
              </Link>
              <span>•</span>
              <span>{poem.year}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <Button size="lg" className="gap-2">
              <Heart className="h-5 w-5" />
              <span>Save ({poem.favorites})</span>
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <BookMarked className="h-5 w-5" />
              <span>Add to Collection</span>
            </Button>
          </div>

          {/* Poem body */}
          <Card className="border-2">
            <CardContent className="p-12">
              <pre className="poem-text whitespace-pre-wrap font-serif text-foreground/90">
                {poem.body}
              </pre>
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/20 border-2 border-primary/20">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-serif font-bold">AI Literary Analysis</h3>
                </div>
                {!showAnalysis && (
                  <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? "Analyzing..." : "Analyze This Poem"}
                  </Button>
                )}
              </div>
              
              {showAnalysis && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : result ? (
                    <p className="text-base leading-relaxed">{result}</p>
                  ) : null}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Powered by AI • Provides literary insights on themes, devices, and meaning
              </p>
            </CardContent>
          </Card>

          {/* About the poet */}
          <Card className="bg-muted/30">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-2xl font-serif font-bold">About {poem.poet}</h3>
              <p className="text-base leading-relaxed">
                Robert Frost (1874–1963) was an American poet whose work was initially published in England before it was published in the United States. Known for his realistic depictions of rural life and his command of American colloquial speech, Frost frequently wrote about settings from rural life in New England, using them to examine complex social and philosophical themes.
              </p>
              <Button variant="outline" asChild>
                <Link to={`/poet/${poem.poetId}`}>
                  View all poems by {poem.poet} →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Related poems */}
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-serif font-bold">You might also enjoy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "2", title: "Stopping by Woods on a Snowy Evening", poet: "Robert Frost" },
                { id: "3", title: "Fire and Ice", poet: "Robert Frost" },
              ].map((relatedPoem) => (
                <Card key={relatedPoem.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Link to={`/poem/${relatedPoem.id}`}>
                      <h4 className="font-serif text-xl font-bold hover:text-primary transition-colors">
                        {relatedPoem.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2">by {relatedPoem.poet}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoemDetail;
