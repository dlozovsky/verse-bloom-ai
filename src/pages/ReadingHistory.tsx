import { useAuth } from "@/contexts/AuthContext";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ReadingHistory = () => {
  const { user } = useAuth();
  const { data: history, isLoading } = useReadingHistory();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Sign In Required</h1>
            <p className="text-muted-foreground">Sign in to track your reading history</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">Reading History</h1>
              <p className="text-muted-foreground mt-1">Your recent poetry journey</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item: any) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -top-2 right-3 z-10">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {formatDistanceToNow(new Date(item.read_at), { addSuffix: true })}
                      </span>
                    </div>
                    <PoemCard
                      id={item.poems.id}
                      title={item.poems.title}
                      poet={item.poems.poets.name}
                      poetId={item.poems.poet_id}
                      excerpt={item.poems.body.split('\n').slice(0, 3).join('\n') + '...'}
                      theme={item.poems.poem_themes?.[0]?.themes?.name}
                      views={0}
                      favorites={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-lg">No reading history yet. Start exploring!</p>
              <Button asChild>
                <Link to="/discover">Discover Poems</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadingHistory;
