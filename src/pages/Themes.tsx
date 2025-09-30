import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Lightbulb, Smile, Cloud, Star, Flame, Music } from "lucide-react";

const Themes = () => {
  const themes = [
    {
      id: "love",
      name: "Love & Romance",
      description: "Explore the depths of human connection and passion",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      count: 1247,
    },
    {
      id: "nature",
      name: "Nature & Seasons",
      description: "Journey through landscapes and the natural world",
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      count: 892,
    },
    {
      id: "hope",
      name: "Hope & Resilience",
      description: "Find strength and inspiration in uplifting verses",
      icon: Lightbulb,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      count: 634,
    },
    {
      id: "joy",
      name: "Joy & Celebration",
      description: "Celebrate life's beautiful moments",
      icon: Smile,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      count: 523,
    },
    {
      id: "melancholy",
      name: "Melancholy & Loss",
      description: "Navigate sorrow and find solace in shared experience",
      icon: Cloud,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      count: 756,
    },
    {
      id: "wisdom",
      name: "Wisdom & Philosophy",
      description: "Contemplate life's deeper meanings",
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      count: 489,
    },
    {
      id: "passion",
      name: "Passion & Desire",
      description: "Experience intensity and raw emotion",
      icon: Flame,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      count: 412,
    },
    {
      id: "beauty",
      name: "Beauty & Art",
      description: "Appreciate aesthetic wonder and creative expression",
      icon: Music,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      count: 567,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Explore by Theme
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover poetry organized by universal themes and emotions
            </p>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <Link key={theme.id} to={`/theme/${theme.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary/50">
                    <CardContent className="p-6 space-y-4">
                      <div className={`inline-flex p-4 rounded-2xl ${theme.bgColor}`}>
                        <Icon className={`h-8 w-8 ${theme.color}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                          {theme.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {theme.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary" className="text-xs">
                          {theme.count.toLocaleString()} poems
                        </Badge>
                        <span className="text-sm text-primary group-hover:translate-x-1 transition-transform">
                          Explore →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/30 rounded-2xl p-12 text-center space-y-4 mt-12">
            <h2 className="text-3xl font-serif font-bold">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Try our advanced search to find poems by specific keywords, poets, or time periods
            </p>
            <Link to="/discover">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                Advanced Search
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Themes;
