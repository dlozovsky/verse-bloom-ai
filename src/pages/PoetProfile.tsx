import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Calendar, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PoetProfile = () => {
  const { id } = useParams();

  // Mock data
  const poet = {
    name: "Robert Frost",
    initials: "RF",
    born: "March 26, 1874",
    died: "January 29, 1963",
    birthplace: "San Francisco, California",
    bio: "Robert Lee Frost was an American poet. His work was initially published in England before it was published in the United States. Known for his realistic depictions of rural life and his command of American colloquial speech, Frost frequently wrote about settings from rural life in New England in the early 20th century, using them to examine complex social and philosophical themes.",
    followers: 12450,
    totalPoems: 87,
  };

  const poems = [
    {
      id: "1",
      title: "The Road Not Taken",
      poet: "Robert Frost",
      excerpt: "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood...",
      theme: "Life & Choices",
      views: 15420,
      favorites: 892,
    },
    {
      id: "2",
      title: "Stopping by Woods on a Snowy Evening",
      poet: "Robert Frost",
      excerpt: "Whose woods these are I think I know. His house is in the village though; He will not see me stopping here...",
      theme: "Nature",
      views: 13200,
      favorites: 756,
    },
    {
      id: "3",
      title: "Fire and Ice",
      poet: "Robert Frost",
      excerpt: "Some say the world will end in fire, Some say in ice. From what I've tasted of desire...",
      theme: "Philosophy",
      views: 11800,
      favorites: 634,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-muted/50 to-accent/30 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {poet.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{poet.name}</h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {poet.born} - {poet.died}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {poet.birthplace}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed">{poet.bio}</p>
                
                <div className="flex items-center gap-4 pt-4">
                  <Button size="lg" className="gap-2">
                    <Heart className="h-5 w-5" />
                    Follow ({poet.followers.toLocaleString()})
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Poems section */}
        <section className="container py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold">Poems</h2>
                <p className="text-muted-foreground">{poet.totalPoems} poems by {poet.name}</p>
              </div>
              <Button variant="outline">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poems.map((poem) => (
                <PoemCard key={poem.id} {...poem} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoetProfile;
