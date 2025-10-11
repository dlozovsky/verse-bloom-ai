import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Favorites = () => {
  const { user } = useAuth();
  const { data: favorites, isLoading } = useFavorites();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Sign In Required</h1>
            <p className="text-muted-foreground">You need to sign in to view your favorites</p>
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
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">My Favorites</h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav: any) => (
                <PoemCard
                  key={fav.poem_id}
                  id={fav.poems.id}
                  title={fav.poems.title}
                  poet={fav.poems.poets.name}
                  excerpt={fav.poems.body.split('\n').slice(0, 3).join('\n') + '...'}
                  theme={fav.poems.poem_themes[0]?.themes.name}
                  views={0}
                  favorites={0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-lg">You haven't favorited any poems yet</p>
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

export default Favorites;
