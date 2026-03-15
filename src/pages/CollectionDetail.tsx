import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { useCollectionPoems } from "@/hooks/useCollections";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Library, BookOpen, Trash2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCollections } from "@/hooks/useCollections";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: collectionPoems, isLoading: poemsLoading } = useCollectionPoems(id || "");
  const { removePoemFromCollection } = useCollections(user?.id);

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ["collection-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*, profiles:user_id(display_name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  usePageTitle(collection ? `${collection.name} — Collection` : "Collection");

  const isOwner = user?.id === collection?.user_id;
  const isLoading = poemsLoading || collectionLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Library className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Collection Not Found</h1>
            <p className="text-muted-foreground">This collection doesn't exist or is private.</p>
            <Button asChild>
              <Link to="/collections">Browse Collections</Link>
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
          <Link to="/collections" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to collections
          </Link>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Library className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold">{collection.name}</h1>
                <p className="text-muted-foreground">
                  {collection.is_public ? "Public" : "Private"} collection
                  {(collection.profiles as any)?.display_name && ` by ${(collection.profiles as any).display_name}`}
                  {" · "}{collectionPoems?.length || 0} poems
                </p>
              </div>
            </div>
            {collection.description && (
              <p className="text-muted-foreground max-w-2xl">{collection.description}</p>
            )}
          </div>

          {collectionPoems && collectionPoems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionPoems.map((item: any) => (
                <div key={`${item.collection_id}-${item.poem_id}`} className="relative group">
                  {isOwner && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => removePoemFromCollection.mutate({ collectionId: id!, poemId: item.poem_id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <PoemCard
                    id={item.poems.id}
                    title={item.poems.title}
                    poet={item.poems.poets.name}
                    poetId={item.poems.poet_id}
                    excerpt={item.poems.body.split('\n').slice(0, 3).join('\n') + '...'}
                    views={item.poems.views || 0}
                    favorites={item.poems.favorites || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-lg">This collection is empty.</p>
              <Button asChild>
                <Link to="/discover">Discover Poems to Add</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionDetail;
