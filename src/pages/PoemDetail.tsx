import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Share2, BookMarked, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoemDetail, useIncrementViews, useRelatedPoems } from "@/hooks/usePoemDetail";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { useAddToHistory } from "@/hooks/useReadingHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PoemDetail = () => {
  const { id } = useParams();
  const { data: poem, isLoading: isPoemLoading } = usePoemDetail(id);
  const { mutate: incrementViews } = useIncrementViews();
  const { mutate: addToHistory } = useAddToHistory();
  const { data: relatedPoems } = useRelatedPoems(poem?.poets?.id, id);
  const { analyzePoem, isLoading, result } = useAIAnalysis();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { user } = useAuth();
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(id || "");
  const { mutate: toggleFavorite, isPending: isToggling } = useToggleFavorite();
  const { toast } = useToast();

  // Increment views and add to reading history on mount
  useEffect(() => {
    if (id) {
      incrementViews(id);
      if (user) {
        addToHistory(id);
      }
    }
  }, [id, user, incrementViews, addToHistory]);

  const handleAnalyze = async () => {
    if (!poem) return;
    setShowAnalysis(true);
    await analyzePoem({
      title: poem.title,
      body: poem.body,
      poet: poem.poets.name,
    }, "analyze");
  };

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save poems to your favorites.",
        variant: "destructive",
      });
      return;
    }
    if (id) {
      toggleFavorite(id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: poem?.title,
        text: `Check out "${poem?.title}" by ${poem?.poets.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Poem link copied to clipboard!",
      });
    }
  };

  if (isPoemLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Poem Not Found</h1>
            <p className="text-muted-foreground mb-8">The poem you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            {poem.poem_themes?.[0] && (
              <span className="inline-block text-sm font-medium text-secondary bg-accent px-3 py-1 rounded">
                {poem.poem_themes[0].themes.name}
              </span>
            )}
            <h1 className="poem-title">{poem.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link to={`/poet/${poem.poets.id}`} className="text-lg hover:text-primary transition-colors">
                by {poem.poets.name}
              </Link>
              {poem.year_published && (
                <>
                  <span>•</span>
                  <span>{poem.year_published}</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              size="lg" 
              className="gap-2" 
              onClick={handleFavorite}
              disabled={isToggling || isFavoriteLoading}
              variant={isFavorite ? "default" : "outline"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
              <span>Share</span>
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
          {poem.poets.bio && (
            <Card className="bg-muted/30">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-serif font-bold">About {poem.poets.name}</h3>
                <p className="text-base leading-relaxed">
                  {poem.poets.bio}
                </p>
                <Button variant="outline" asChild>
                  <Link to={`/poet/${poem.poets.id}`}>
                    View all poems by {poem.poets.name} →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Related poems */}
          {relatedPoems && relatedPoems.length > 0 && (
            <div className="space-y-6 pt-8">
              <h3 className="text-2xl font-serif font-bold">You might also enjoy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPoems.map((relatedPoem) => (
                  <Card key={relatedPoem.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Link to={`/poem/${relatedPoem.id}`}>
                        <h4 className="font-serif text-xl font-bold hover:text-primary transition-colors">
                          {relatedPoem.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2">by {relatedPoem.poets.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoemDetail;
