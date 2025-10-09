import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User } from "lucide-react";
import { usePoets } from "@/hooks/usePoets";
import { Skeleton } from "@/components/ui/skeleton";

const Poets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: poets, isLoading } = usePoets(searchQuery);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Master Poets</h1>
            <p className="text-xl text-muted-foreground">Explore works from history's greatest literary voices</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search poets..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)
            ) : poets && poets.length > 0 ? (
              poets.map((poet) => (
                <Card key={poet.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <Link to={`/poet/${poet.id}`}>
                          <h3 className="text-xl font-serif font-bold hover:text-primary transition-colors">{poet.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{poet.poems?.[0]?.count || 0} poems</p>
                      </div>
                    </div>
                    {poet.bio && <p className="text-sm text-foreground/80 line-clamp-2">{poet.bio}</p>}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">{searchQuery ? "No poets found." : "No poets available yet."}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Poets;
