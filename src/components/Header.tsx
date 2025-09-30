import { Link } from "react-router-dom";
import { Search, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="font-serif text-2xl font-bold text-primary">Poetry Hub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/discover" className="text-sm font-medium hover:text-primary transition-colors">
            Discover
          </Link>
          <Link to="/poets" className="text-sm font-medium hover:text-primary transition-colors">
            Poets
          </Link>
          <Link to="/themes" className="text-sm font-medium hover:text-primary transition-colors">
            Themes
          </Link>
          <Link to="/random" className="text-sm font-medium hover:text-primary transition-colors">
            Random
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search poems..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="default">Sign In</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
