import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PoemCardProps {
  id: string;
  title: string;
  poet: string;
  poetId: string;
  excerpt: string;
  theme?: string;
  views?: number;
  favorites?: number;
}

const PoemCard = ({ id, title, poet, poetId, excerpt, theme, views, favorites }: PoemCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 h-full">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          {theme && (
            <span className="inline-block text-xs font-medium text-secondary bg-accent px-2 py-1 rounded">
              {theme}
            </span>
          )}
          <Link to={`/poem/${id}`}>
            <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <Link to={`/poet/${poetId}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            by {poet}
          </Link>
        </div>
        
        <p className="font-serif text-base leading-relaxed text-foreground/80 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {views && (
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{views.toLocaleString()}</span>
              </span>
            )}
            {favorites && (
              <span className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{favorites}</span>
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Read more →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemCard;
