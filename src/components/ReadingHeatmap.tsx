import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Trophy, Calendar } from "lucide-react";
import type { StreakData } from "@/hooks/useReadingStreak";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReadingHeatmapProps {
  data: StreakData;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

const getIntensityClass = (count: number): string => {
  if (count === 0) return "bg-muted/50";
  if (count === 1) return "bg-primary/20";
  if (count <= 3) return "bg-primary/40";
  if (count <= 5) return "bg-primary/65";
  return "bg-primary/90";
};

const ReadingHeatmap = ({ data }: ReadingHeatmapProps) => {
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build a map for quick lookup
    const activityMap = new Map<string, number>();
    data.dailyActivity.forEach((d) => activityMap.set(d.date, d.count));

    // Generate 52 weeks (364 days) ending today
    const totalDays = 364;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: { date: Date; count: number; dateStr: string }[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    let currentWeek: { date: Date; count: number; dateStr: string }[] = [];

    const cursor = new Date(startDate);
    while (cursor <= today) {
      const dateStr = cursor.toISOString().split("T")[0];
      const count = activityMap.get(dateStr) || 0;

      if (cursor.getDay() === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      if (cursor.getMonth() !== lastMonth) {
        monthLabels.push({ label: MONTHS[cursor.getMonth()], col: weeks.length });
        lastMonth = cursor.getMonth();
      }

      currentWeek.push({ date: new Date(cursor), count, dateStr });
      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { grid: weeks, monthLabels };
  }, [data.dailyActivity]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Reading Activity
        </CardTitle>
        <CardDescription>Your daily poetry reading over the past year</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
            <Flame className="h-4 w-4 text-primary" />
            <div>
              <p className="text-lg font-bold leading-none">{data.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-secondary/10 rounded-lg px-3 py-2">
            <Trophy className="h-4 w-4 text-secondary" />
            <div>
              <p className="text-lg font-bold leading-none">{data.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-accent rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4 text-accent-foreground" />
            <div>
              <p className="text-lg font-bold leading-none">{data.totalDaysRead}</p>
              <p className="text-xs text-muted-foreground">Days active</p>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Month labels */}
            <div className="flex ml-8 mb-1">
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="text-xs text-muted-foreground"
                  style={{
                    position: "relative",
                    left: `${m.col * 14}px`,
                    marginRight: i < monthLabels.length - 1
                      ? `${(monthLabels[i + 1].col - m.col) * 14 - 28}px`
                      : 0,
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex gap-[2px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[2px] mr-1">
                {DAYS.map((d, i) => (
                  <span key={i} className="text-xs text-muted-foreground h-[12px] leading-[12px] w-6 text-right">
                    {d}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <TooltipProvider delayDuration={100}>
                <div className="flex gap-[2px]">
                  {grid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((_, di) => {
                        const cell = week[di];
                        if (!cell) {
                          return <div key={di} className="w-[12px] h-[12px]" />;
                        }
                        return (
                          <Tooltip key={di}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-[12px] h-[12px] rounded-[2px] ${getIntensityClass(cell.count)} transition-colors hover:ring-1 hover:ring-foreground/30`}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              <p className="font-medium">
                                {cell.count} poem{cell.count !== 1 ? "s" : ""} read
                              </p>
                              <p className="text-muted-foreground">
                                {cell.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1 mt-2 justify-end">
              <span className="text-xs text-muted-foreground mr-1">Less</span>
              {[0, 1, 2, 4, 6].map((count) => (
                <div
                  key={count}
                  className={`w-[12px] h-[12px] rounded-[2px] ${getIntensityClass(count)}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingHeatmap;
