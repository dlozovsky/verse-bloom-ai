import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "Page Not Found — Poetry Hub";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-lg">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-6xl font-serif font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">
            This page seems to have wandered off like a lost stanza.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/discover">Discover Poems</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
