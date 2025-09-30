import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Discover = () => {
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
      
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Discover Poetry</h1>
            <p className="text-xl text-muted-foreground">
              Explore thousands of poems across themes, eras, and poets
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, poet, or theme..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  <SelectItem value="love">Love</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                  <SelectItem value="hope">Hope</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Showing {poems.length} poems</p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="favorites">Most Favorited</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poems.map((poem) => (
                <PoemCard key={poem.id} {...poem} />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button size="lg">Load More Poems</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
