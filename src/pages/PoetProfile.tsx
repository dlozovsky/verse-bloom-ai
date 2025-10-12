import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { ArrowLeft, User } from "lucide-react";
import { usePoetDetail } from "@/hooks/usePoets";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PoetProfile = () => {
  const { id } = useParams();
  const { data: poet, isLoading } = usePoetDetail(id);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container py-12"><Skeleton className="h-64" /></main><Footer /></div>
  );

  if (!poet) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container py-12 text-center"><h1 className="text-4xl font-bold mb-4">Poet Not Found</h1><Button asChild><Link to="/poets">Browse Poets</Link></Button></main><Footer /></div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <Link to="/poets" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to poets</Link>
          <div className="flex items-start space-x-8">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"><User className="h-16 w-16 text-primary" /></div>
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold">{poet.name}</h1>
              {(poet.birth_year || poet.nationality) && (
                <p className="text-lg text-muted-foreground">{poet.birth_year && `${poet.birth_year}${poet.death_year ? `–${poet.death_year}` : ''}`}{poet.birth_year && poet.nationality && ' • '}{poet.nationality}</p>
              )}
              {poet.bio && <p className="text-base leading-relaxed max-w-3xl">{poet.bio}</p>}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold">Poems by {poet.name}</h2>
            {poet.poems && poet.poems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poet.poems.map((poem) => (
                  <PoemCard key={poem.id} id={poem.id} title={poem.title} poet={poet.name} poetId={poet.id} excerpt={poem.body.split('\n').slice(0, 3).join('\n') + '...'} theme={poem.poem_themes?.[0]?.themes.name} views={poem.views} favorites={poem.favorites} />
                ))}
              </div>
            ) : <p className="text-muted-foreground">No poems available.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoetProfile;
