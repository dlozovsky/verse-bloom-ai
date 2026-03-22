import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PoemCard from "@/components/PoemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePoems } from "@/hooks/usePoems";
import { useThemes } from "@/hooks/useThemes";
import { useAISearch } from "@/hooks/useAISearch";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 12;

type SortOption = "newest" | "popular" | "favorites" | "alphabetical";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get("theme") || "all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [showAiResults, setShowAiResults] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: poems, isLoading } = usePoems(undefined, selectedTheme !== "all" ? selectedTheme : undefined);
  const { data: themes } = useThemes();
  const aiSearch = useAISearch();

  // SEOHead handles page title

  useEffect(() => {
    if (searchParams.get("theme")) setSelectedTheme(searchParams.get("theme") || "all");
    if (searchParams.get("search")) setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTheme, sortBy]);

  const filteredPoems = poems
    ?.filter(p =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.poets.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case "popular": return (b.views || 0) - (a.views || 0);
        case "favorites": return (b.favorites || 0) - (a.favorites || 0);
        case "alphabetical": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const paginatedPoems = filteredPoems?.slice(0, visibleCount);
  const hasMore = filteredPoems ? visibleCount < filteredPoems.length : false;

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setShowAiResults(false);
    const result = await aiSearch.mutateAsync({ query: searchQuery, type: 'poem' });
    if (result.found && result.source === 'ai') {
      setAiResults(result.results || []);
      setShowAiResults(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Discover Poetry"
        description="Browse and search thousands of classic poems by theme, popularity, or title. Find your next favorite verse."
        canonicalPath="/discover"
      />
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Discover Poetry</h1>
            {filteredPoems && (
              <p className="text-muted-foreground mt-2">{filteredPoems.length} poems found</p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search poems or poets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowAiResults(false); }}
                onKeyDown={(e) => e.key === 'Enter' && filteredPoems && filteredPoems.length === 0 && handleAISearch()}
              />
            </div>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {themes?.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="favorites">Most Favorited</SelectItem>
                <SelectItem value="alphabetical">A – Z</SelectItem>
              </SelectContent>
            </Select>
            {searchQuery && filteredPoems && filteredPoems.length === 0 && !showAiResults && (
              <Button onClick={handleAISearch} disabled={aiSearch.isPending} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {aiSearch.isPending ? 'Searching...' : 'Try AI Search'}
              </Button>
            )}
          </div>

          {showAiResults && aiResults.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <Badge variant="secondary">AI Discovery</Badge>
              </div>
              <p className="text-sm text-muted-foreground">We found this poem using AI and added it to our collection!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading || aiSearch.isPending ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
            ) : showAiResults && aiResults.length > 0 ? (
              aiResults.map((p) => (
                <PoemCard
                  key={p.id} id={p.id} title={p.title} poet={p.poets.name} poetId={p.poet_id}
                  excerpt={p.body.split('\n').slice(0, 3).join('\n') + '...'}
                  theme={p.poem_themes?.[0]?.themes?.name} views={p.views || 0} favorites={p.favorites || 0}
                />
              ))
            ) : paginatedPoems && paginatedPoems.length > 0 ? (
              paginatedPoems.map((p) => (
                <PoemCard
                  key={p.id} id={p.id} title={p.title} poet={p.poets.name} poetId={p.poet_id}
                  excerpt={p.body.split('\n').slice(0, 3).join('\n') + '...'}
                  theme={p.poem_themes[0]?.themes.name} views={p.views} favorites={p.favorites}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 space-y-4">
                <p className="text-muted-foreground">
                  {searchQuery ? `No poems found for "${searchQuery}".` : "No poems found."}
                </p>
                {searchQuery && (
                  <Button onClick={handleAISearch} disabled={aiSearch.isPending} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {aiSearch.isPending ? 'Searching with AI...' : 'Try AI Discovery'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {hasMore && !showAiResults && (
            <div className="text-center pt-4">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)} className="gap-2">
                Load More Poems
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Showing {paginatedPoems?.length} of {filteredPoems?.length} poems
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
