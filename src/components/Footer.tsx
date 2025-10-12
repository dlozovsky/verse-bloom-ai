import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold text-primary">Poetry Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover and explore timeless poetry from history's greatest voices.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discover" className="text-muted-foreground hover:text-primary transition-colors">
                  Discover Poems
                </Link>
              </li>
              <li>
                <Link to="/poets" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Poets
                </Link>
              </li>
              <li>
                <Link to="/themes" className="text-muted-foreground hover:text-primary transition-colors">
                  Themes
                </Link>
              </li>
              <li>
                <Link to="/random" className="text-muted-foreground hover:text-primary transition-colors">
                  Random Poem
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                AI-Powered Analysis
              </li>
              <li className="text-muted-foreground">
                Personal Collections
              </li>
              <li className="text-muted-foreground">
                Daily Inspiration
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span>for poetry lovers everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
