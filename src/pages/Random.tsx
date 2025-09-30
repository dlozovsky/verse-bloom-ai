import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle, ArrowRight, Sparkles } from "lucide-react";

const Random = () => {
  const navigate = useNavigate();
  const [isShuffling, setIsShuffling] = useState(false);

  // Mock poems database
  const poems = [
    { id: "1", title: "The Road Not Taken", poet: "Robert Frost" },
    { id: "2", title: "Still I Rise", poet: "Maya Angelou" },
    { id: "3", title: "Daffodils", poet: "William Wordsworth" },
    { id: "4", title: "If—", poet: "Rudyard Kipling" },
    { id: "5", title: "Hope is the Thing with Feathers", poet: "Emily Dickinson" },
    { id: "6", title: "Sonnet 18", poet: "William Shakespeare" },
    { id: "7", title: "The Raven", poet: "Edgar Allan Poe" },
    { id: "8", title: "Do Not Go Gentle Into That Good Night", poet: "Dylan Thomas" },
  ];

  const [currentPoem, setCurrentPoem] = useState(poems[0]);

  const getRandomPoem = () => {
    setIsShuffling(true);
    
    // Simulate animation delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * poems.length);
      setCurrentPoem(poems[randomIndex]);
      setIsShuffling(false);
    }, 500);
  };

  const goToPoem = () => {
    navigate(`/poem/${currentPoem.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Discover by Chance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Random Poem Discovery
            </h1>
            <p className="text-xl text-muted-foreground">
              Let serendipity guide your literary journey
            </p>
          </div>

          {/* Poem Display Card */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-12 text-center space-y-6">
              <div className={`space-y-4 transition-all duration-500 ${isShuffling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                  {currentPoem.title}
                </h2>
                <p className="text-xl text-muted-foreground">
                  by {currentPoem.poet}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                <Button
                  size="lg"
                  onClick={goToPoem}
                  className="gap-2"
                >
                  Read This Poem
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={getRandomPoem}
                  disabled={isShuffling}
                  className="gap-2"
                >
                  <Shuffle className={`h-5 w-5 ${isShuffling ? 'animate-spin' : ''}`} />
                  {isShuffling ? 'Shuffling...' : 'Another One'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="bg-muted/30 rounded-2xl p-8 space-y-4">
            <h3 className="text-2xl font-serif font-bold text-center">
              Why Random Discovery?
            </h3>
            <p className="text-center text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Sometimes the best discoveries happen by chance. Let our random selector 
              introduce you to poems you might never have found otherwise. Each click 
              is a new adventure into the world of verse.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Random;
