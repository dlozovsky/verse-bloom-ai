import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Poets = () => {
  const poets = [
    { id: "1", name: "Robert Frost", initials: "RF", era: "Modern", poemCount: 87, followers: 12450 },
    { id: "2", name: "Maya Angelou", initials: "MA", era: "Contemporary", poemCount: 65, followers: 15230 },
    { id: "3", name: "William Wordsworth", initials: "WW", era: "Romantic", poemCount: 134, followers: 9870 },
    { id: "4", name: "Emily Dickinson", initials: "ED", era: "Victorian", poemCount: 156, followers: 11240 },
    { id: "5", name: "William Shakespeare", initials: "WS", era: "Renaissance", poemCount: 154, followers: 18900 },
    { id: "6", name: "Edgar Allan Poe", initials: "EP", era: "Romantic", poemCount: 73, followers: 13560 },
    { id: "7", name: "Langston Hughes", initials: "LH", era: "Modern", poemCount: 92, followers: 10340 },
    { id: "8", name: "Sylvia Plath", initials: "SP", era: "Contemporary", poemCount: 45, followers: 14780 },
    { id: "9", name: "Pablo Neruda", initials: "PN", era: "Modern", poemCount: 112, followers: 16230 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">{poets.length} Poets</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Master Poets
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore works from history's greatest literary voices
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search poets by name..."
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Era" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eras</SelectItem>
                <SelectItem value="renaissance">Renaissance</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="victorian">Victorian</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="contemporary">Contemporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Poets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poets.map((poet) => (
              <Link key={poet.id} to={`/poet/${poet.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {poet.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                          {poet.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{poet.era}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-sm text-muted-foreground">
                      <span>{poet.poemCount} poems</span>
                      <span>{poet.followers.toLocaleString()} followers</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Discover More CTA */}
          <div className="bg-gradient-to-br from-muted/50 to-accent/30 rounded-2xl p-12 text-center space-y-4 mt-12">
            <h2 className="text-3xl font-serif font-bold">
              Discover More Poets
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our collection spans centuries of poetic tradition, from ancient verses 
              to contemporary works. Each poet brings a unique voice to the eternal 
              themes of human experience.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Poets;
