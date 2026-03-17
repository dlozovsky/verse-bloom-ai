import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysRead: number;
  dailyActivity: DayActivity[];
}

const calculateStreaks = (dates: string[]): { current: number; longest: number } => {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = [...new Set(dates)].sort().reverse(); // newest first
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const toDateStr = (d: Date) => d.toISOString().split("T")[0];

  // Current streak: count consecutive days ending today or yesterday
  let current = 0;
  const firstDay = uniqueDays[0];
  if (firstDay === toDateStr(today) || firstDay === toDateStr(yesterday)) {
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - (firstDay === toDateStr(today) ? i : i + 1));
      if (uniqueDays[i] === toDateStr(expected)) {
        current++;
      } else break;
    }
  }

  // Longest streak
  const sorted = [...new Set(dates)].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return { current, longest };
};

export const useReadingStreak = (userId?: string) => {
  return useQuery<StreakData>({
    queryKey: ["reading-streak", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user");

      // Fetch last 365 days of reading history
      const since = new Date();
      since.setFullYear(since.getFullYear() - 1);

      const { data, error } = await supabase
        .from("reading_history")
        .select("read_at")
        .eq("user_id", userId)
        .gte("read_at", since.toISOString())
        .order("read_at", { ascending: false });

      if (error) throw error;

      // Group by day
      const dayMap = new Map<string, number>();
      (data || []).forEach((r) => {
        const day = r.read_at.split("T")[0];
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });

      const dailyActivity: DayActivity[] = Array.from(dayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const allDays = Array.from(dayMap.keys());
      const { current, longest } = calculateStreaks(allDays);

      return {
        currentStreak: current,
        longestStreak: longest,
        totalDaysRead: dayMap.size,
        dailyActivity,
      };
    },
    enabled: !!userId,
  });
};
