import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PoemCard from "@/components/PoemCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, BookMarked } from "lucide-react";
import { useFeaturedPoems } from "@/hooks/usePoems";
import { useThemes } from "@/hooks/useThemes";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trees, Book } from "lucide-react";

const Index = () => {
  const { data: featuredPoems, isLoading } = useFeaturedPoems();
  const { data: themes, isLoading: themesLoading } = useThemes();
  
  const iconMap: Record<string, any> = { "Love": Heart, "Nature": Trees, "Philosophy": Book, "Life & Choices": Sparkles };
  const getIcon = (name: string) => iconMap[name] || Book;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      
      <main className="flex-1 container py-12 space-y-16">
        {/* Featured Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-3xl font-serif font-bold">Featured Poems</h2>
              </div>
              <p className="text-muted-foreground">Most viewed masterpieces to inspire your day</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/discover">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))
            ) : featuredPoems && featuredPoems.length > 0 ? (
              featuredPoems.map((poem) => (
                <PoemCard
                  key={poem.id}
                  id={poem.id}
                  title={poem.title}
                  poet={poem.poets.name}
                  poetId={poem.poet_id}
                  excerpt={poem.body.split('\n').slice(0, 3).join('\n') + '...'}
                  theme={poem.poem_themes[0]?.themes.name}
                  views={poem.views}
                  favorites={poem.favorites}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No poems found. Add some poems to get started!</p>
                <Button asChild className="mt-4">
                  <Link to="/discover">Explore Poems</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Themes Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h2 className="text-3xl font-serif font-bold">Explore by Theme</h2>
              </div>
              <p className="text-muted-foreground">Journey through poetry by universal themes</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/themes">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))
            ) : themes && themes.length > 0 ? (
              themes.slice(0, 4).map((theme) => {
                const Icon = getIcon(theme.name);
                return (
                  <Link key={theme.id} to={`/discover?theme=${theme.name}`}>
                    <Card className="group hover:shadow-lg transition-all h-full">
                      <CardContent className="p-6 space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{theme.name}</h3>
                        <Badge variant="secondary">{theme.poem_themes?.[0]?.count || 0} poems</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-muted-foreground">No themes available.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
