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
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit a Poem
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="text-muted-foreground hover:text-primary transition-colors">
                  Copyright
                </Link>
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
