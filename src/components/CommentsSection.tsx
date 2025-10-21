import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters")
});

interface CommentsSectionProps {
  poemId: string;
}

export const CommentsSection = ({ poemId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment } = useComments(poemId);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = commentSchema.safeParse({ content: newComment });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    addComment.mutate(newComment, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-serif font-bold">Comments</h3>
        <span className="text-muted-foreground">({comments?.length || 0})</span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts on this poem..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
            className="min-h-[100px]"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {newComment.length}/1000
            </span>
            <Button 
              type="submit" 
              disabled={addComment.isPending || !newComment.trim()}
            >
              {addComment.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please sign in to leave a comment</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {Array.isArray(comment.profiles) 
                        ? comment.profiles[0]?.display_name 
                        : (comment.profiles as any)?.display_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteComment.mutate(comment.id)}
                      disabled={deleteComment.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
