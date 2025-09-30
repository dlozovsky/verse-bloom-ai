import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtOC44LTcuMi0xNi0xNi0xNlMwIDcuMiAwIDE2czE2IDI0IDE2IDI0IDIwLTE1LjIgMjAtMjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Discover timeless verses</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Where Words
            <br />
            Become <span className="text-secondary">Magic</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
            Explore thousands of classic poems from history's greatest poets. 
            Find beauty, meaning, and inspiration in every verse.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <Link to="/discover">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Reading
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-white/20 hover:bg-white/10 text-white" asChild>
              <Link to="/random">
                Surprise Me
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
