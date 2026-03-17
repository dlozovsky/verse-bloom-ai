import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, Heart, LogOut, User, Menu, X, Moon, Sun, Library, Clock } from "lucide-react";
import GuestBanner from "@/components/GuestBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/discover", label: "Discover" },
    { to: "/poets", label: "Poets" },
    { to: "/themes", label: "Themes" },
    { to: "/collections", label: "Collections" },
    { to: "/random", label: "Random" },
  ];

  return (
    <>
    <GuestBanner />
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="font-serif text-2xl font-bold text-primary">Poetry Hub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search poems..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                <Link to="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" />
                      My Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/collections" className="cursor-pointer">
                      <Library className="h-4 w-4 mr-2" />
                      Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/reading-history" className="cursor-pointer">
                      <Clock className="h-4 w-4 mr-2" />
                      Reading History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          {/* Mobile hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile search */}
                <form onSubmit={(e) => { handleSearch(e); }} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search poems..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                {/* Mobile nav links */}
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <Link to={link.to} className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="border-t pt-4 space-y-1">
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/favorites" className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors">
                          <Heart className="h-5 w-5 mr-3" />
                          My Favorites
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/reading-history" className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors">
                          <Clock className="h-5 w-5 mr-3" />
                          Reading History
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors">
                          <User className="h-5 w-5 mr-3" />
                          Profile
                        </Link>
                      </SheetClose>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors w-full text-left"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/auth" className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors">
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>

                {/* Dark mode toggle in mobile */}
                <div className="border-t pt-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center py-3 px-3 rounded-md text-base font-medium hover:bg-accent transition-colors w-full text-left"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
