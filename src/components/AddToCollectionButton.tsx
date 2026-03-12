import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCollections } from "@/hooks/useCollections";
import { useToast } from "@/hooks/use-toast";
import { Library, Plus, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface AddToCollectionButtonProps {
  poemId: string;
}

const AddToCollectionButton = ({ poemId }: AddToCollectionButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { collections, isLoading, addPoemToCollection } = useCollections(user?.id);

  if (!user) {
    return (
      <Button size="lg" variant="outline" className="gap-2" asChild>
        <Link to="/auth">
          <Library className="h-5 w-5" />
          <span>Add to Collection</span>
        </Link>
      </Button>
    );
  }

  const handleAdd = (collectionId: string, collectionName: string) => {
    addPoemToCollection.mutate(
      { collectionId, poemId },
      {
        onSuccess: () => {
          toast({
            title: "Added to Collection",
            description: `Poem added to "${collectionName}"`,
          });
        },
        onError: (error: any) => {
          const msg = error?.message || "";
          if (msg.includes("duplicate") || msg.includes("unique")) {
            toast({ title: "Already in Collection", description: `This poem is already in "${collectionName}"` });
          } else {
            toast({ title: "Error", description: "Failed to add poem to collection", variant: "destructive" });
          }
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2">
          <Library className="h-5 w-5" />
          <span>Add to Collection</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : collections && collections.length > 0 ? (
          collections.map((c: any) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => handleAdd(c.id, c.name)}
              className="cursor-pointer"
            >
              <Library className="h-4 w-4 mr-2" />
              {c.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No collections yet</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/collections" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Create New Collection
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToCollectionButton;
