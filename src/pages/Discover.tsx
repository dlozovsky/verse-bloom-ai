import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PoemCard from "@/components/PoemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePoems } from "@/hooks/usePoems";
import { useThemes } from "@/hooks/useThemes";
import { Skeleton } from "@/components/ui/skeleton";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get("theme") || "all");
  const { data: poems, isLoading } = usePoems(undefined, selectedTheme !== "all" ? selectedTheme : undefined);
  const { data: themes } = useThemes();

  useEffect(() => { 
    if (searchParams.get("theme")) setSelectedTheme(searchParams.get("theme") || "all");
    if (searchParams.get("search")) setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredPoems = poems?.filter(p => 
    !searchQuery || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.poets.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Discover Poetry</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {themes?.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
            ) : filteredPoems && filteredPoems.length > 0 ? (
              filteredPoems.map((p) => <PoemCard key={p.id} id={p.id} title={p.title} poet={p.poets.name} poetId={p.poet_id} excerpt={p.body.split('\n').slice(0, 3).join('\n') + '...'} theme={p.poem_themes[0]?.themes.name} views={p.views} favorites={p.favorites} />)
            ) : (
              <div className="col-span-3 text-center py-12"><p className="text-muted-foreground">No poems found.</p></div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
