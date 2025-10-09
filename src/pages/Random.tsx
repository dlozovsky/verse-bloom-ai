import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { useRandomPoem } from "@/hooks/usePoems";
import { Skeleton } from "@/components/ui/skeleton";

const Random = () => {
  const { data: randomPoem, isLoading, refetch } = useRandomPoem();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Random Discovery</h1>
              <p className="text-lg text-muted-foreground">Embrace serendipity. Discover a poem chosen just for you.</p>
            </div>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Another Poem</span>
            </Button>
          </div>

          {isLoading ? (
            <Card className="border-2">
              <CardContent className="p-12 space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : randomPoem ? (
            <Card className="border-2">
              <CardContent className="p-12 space-y-6">
                <div className="flex items-center justify-between">
                  {randomPoem.poem_themes?.[0] && (
                    <span className="inline-block text-sm font-medium text-secondary bg-accent px-3 py-1 rounded">
                      {randomPoem.poem_themes[0].themes.name}
                    </span>
                  )}
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="poem-title mb-2">{randomPoem.title}</h2>
                  <Link to={`/poet/${randomPoem.poets.id}`} className="text-lg text-muted-foreground hover:text-primary transition-colors">
                    by {randomPoem.poets.name}{randomPoem.year_published && ` • ${randomPoem.year_published}`}
                  </Link>
                </div>
                <pre className="poem-text whitespace-pre-wrap font-serif text-foreground/90">{randomPoem.body}</pre>
                <div className="pt-6 border-t flex gap-3">
                  <Button size="lg" asChild className="flex-1">
                    <Link to={`/poem/${randomPoem.id}`}>Read Full Analysis</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="flex-1">
                    <Link to={`/poet/${randomPoem.poets.id}`}>More by {randomPoem.poets.name}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No poems available. Add some poems to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Random;
