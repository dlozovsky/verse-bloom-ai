import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Trees, Book } from "lucide-react";
import { useThemes } from "@/hooks/useThemes";
import { Skeleton } from "@/components/ui/skeleton";

const Themes = () => {
  const { data: themes, isLoading } = useThemes();
  const iconMap: Record<string, any> = { "Love": Heart, "Nature": Trees, "Philosophy": Book, "Life & Choices": Sparkles };
  const getIcon = (name: string) => iconMap[name] || Book;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Explore by Theme</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
            ) : themes && themes.length > 0 ? (
              themes.map((theme) => {
                const Icon = getIcon(theme.name);
                return (
                  <Link key={theme.id} to={`/discover?theme=${theme.name}`}>
                    <Card className="group hover:shadow-lg transition-all h-full">
                      <CardContent className="p-8 space-y-4">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">{theme.name}</h3>
                        <Badge variant="secondary">{theme.poem_themes?.[0]?.count || 0} poems</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12"><p className="text-muted-foreground">No themes available.</p></div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Themes;
