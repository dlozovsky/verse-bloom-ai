import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PoemCard from "@/components/PoemCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, BookMarked } from "lucide-react";
import { useFeaturedPoems } from "@/hooks/usePoems";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: featuredPoems, isLoading } = useFeaturedPoems();

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

        {/* Themes CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-accent to-accent/50 p-12 text-center space-y-6">
          <BookMarked className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-3xl font-serif font-bold">Explore by Theme</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through poetry organized by universal themes - from love and loss to nature and joy
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link to="/themes">Explore Themes</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
