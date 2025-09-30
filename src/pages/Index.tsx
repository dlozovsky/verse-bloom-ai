import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PoemCard from "@/components/PoemCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, BookMarked } from "lucide-react";

const Index = () => {
  // Mock data for demonstration
  const featuredPoems = [
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
      title: "Still I Rise",
      poet: "Maya Angelou",
      excerpt: "You may write me down in history With your bitter, twisted lies, You may trod me in the very dirt...",
      theme: "Resilience",
      views: 12350,
      favorites: 743,
    },
    {
      id: "3",
      title: "Daffodils",
      poet: "William Wordsworth",
      excerpt: "I wandered lonely as a cloud That floats on high o'er vales and hills, When all at once I saw a crowd...",
      theme: "Nature",
      views: 9870,
      favorites: 621,
    },
  ];

  const trendingPoems = [
    {
      id: "4",
      title: "If—",
      poet: "Rudyard Kipling",
      excerpt: "If you can keep your head when all about you Are losing theirs and blaming it on you...",
      theme: "Wisdom",
      views: 8920,
      favorites: 567,
    },
    {
      id: "5",
      title: "Hope is the Thing with Feathers",
      poet: "Emily Dickinson",
      excerpt: "Hope is the thing with feathers That perches in the soul, And sings the tune without the words...",
      theme: "Hope",
      views: 7650,
      favorites: 489,
    },
    {
      id: "6",
      title: "Sonnet 18",
      poet: "William Shakespeare",
      excerpt: "Shall I compare thee to a summer's day? Thou art more lovely and more temperate...",
      theme: "Love",
      views: 11200,
      favorites: 834,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      
      <main className="flex-1 container py-12 space-y-16">
        {/* Featured Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-3xl font-serif font-bold">Featured Poems</h2>
              </div>
              <p className="text-muted-foreground">Handpicked masterpieces to inspire your day</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPoems.map((poem) => (
              <PoemCard key={poem.id} {...poem} />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-3xl font-serif font-bold">Trending This Week</h2>
              </div>
              <p className="text-muted-foreground">Most loved poems by our community</p>
            </div>
            <Button variant="outline">See More</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPoems.map((poem) => (
              <PoemCard key={poem.id} {...poem} />
            ))}
          </div>
        </section>

        {/* Themes CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-accent to-accent/50 p-12 text-center space-y-6">
          <BookMarked className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-3xl font-serif font-bold">Explore by Theme</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through poetry organized by universal themes - from love and loss to nature and joy
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button variant="outline">Love</Button>
            <Button variant="outline">Nature</Button>
            <Button variant="outline">Life</Button>
            <Button variant="outline">Hope</Button>
            <Button variant="outline">Sadness</Button>
            <Button variant="outline">Joy</Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
