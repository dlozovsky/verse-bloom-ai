import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCollections } from "@/hooks/useCollections";
import { useAuth } from "@/contexts/AuthContext";
import { Library, Plus, Trash2, User, Lock, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Collections = () => {
  const { user } = useAuth();
  const { collections: publicCollections, isLoading: publicLoading } = useCollections();
  const { collections: myCollections, isLoading: myLoading, createCollection, deleteCollection } = useCollections(user?.id);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    createCollection.mutate(
      { name: name.trim(), description: description.trim() || undefined, is_public: isPublic },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setIsPublic(true);
          setDialogOpen(false);
        },
      }
    );
  };

  const CollectionCard = ({ collection, showDelete }: { collection: any; showDelete?: boolean }) => (
    <Link to={`/collection/${collection.id}`}>
      <Card className="hover:shadow-lg transition-shadow group h-full">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {collection.is_public ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span>{collection.is_public ? "Public" : "Private"}</span>
                  <span>•</span>
                  <span>{(collection.collection_poems as any)?.[0]?.count || 0} poems</span>
                </div>
              </div>
            </div>
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCollection.mutate(collection.id); }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          {collection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
          )}
          {collection.profiles && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>
                {Array.isArray(collection.profiles)
                  ? collection.profiles[0]?.display_name
                  : (collection.profiles as any)?.display_name || "Anonymous"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* My Collections */}
          {user && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold">My Collections</h1>
                  <p className="text-muted-foreground mt-1">Curate your personal poetry anthologies</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="e.g., Romantic Sonnets"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Textarea
                          placeholder="What's this collection about?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Make it public</Label>
                        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                      </div>
                      <Button onClick={handleCreate} className="w-full" disabled={!name.trim() || createCollection.isPending}>
                        {createCollection.isPending ? "Creating..." : "Create Collection"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {myLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
                </div>
              ) : myCollections && myCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCollections.map((c: any) => (
                    <CollectionCard key={c.id} collection={c} showDelete />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center space-y-4">
                    <Library className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">No collections yet. Create your first one!</p>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {/* Public Collections */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold">
                {user ? "Community Collections" : "Poetry Collections"}
              </h2>
              <p className="text-muted-foreground mt-1">
                Curated reading lists from the community
              </p>
            </div>

            {publicLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
              </div>
            ) : publicCollections && publicCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicCollections.map((c: any) => (
                  <CollectionCard key={c.id} collection={c} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center space-y-4">
                  <Library className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No public collections yet. Be the first to create one!</p>
                  {!user && (
                    <Button asChild>
                      <Link to="/auth">Sign In to Create</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
