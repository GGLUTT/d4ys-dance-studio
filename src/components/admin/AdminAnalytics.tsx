
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { BookingRow } from "@/lib/types";

interface AdminAnalyticsProps {
  bookings: BookingRow[];
}

const attendanceChartConfig = {
  bookings: {
    label: "Всього",
    color: "hsl(var(--primary))",
  },
  attended: {
    label: "Відвідано",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AdminAnalytics({ bookings }: AdminAnalyticsProps) {
  // --- Analytics Logic ---
  const attendedBookings = bookings.filter(b => b.status === "attended");
  const attendanceRate = bookings.length > 0 ? Math.round((attendedBookings.length / bookings.length) * 100) : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentBookings = bookings.filter(b => new Date(b.created_at) >= thirtyDaysAgo);
  const recentAttendedBookings = recentBookings.filter(b => b.status === "attended");
  const recentAttendanceRate =
    recentBookings.length > 0
      ? Math.round((recentAttendedBookings.length / recentBookings.length) * 100)
      : 0;

  // Prepare Daily Series (last 30 days)
  const dailySeries = (() => {
    const data: Record<string, { date: string; bookings: number; attended: number }> = {};
    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      data[key] = { date: key, bookings: 0, attended: 0 };
    }
    // Fill data
    recentBookings.forEach(b => {
      const key = new Date(b.created_at).toISOString().slice(0, 10);
      if (data[key]) {
        data[key].bookings += 1;
        if (b.status === "attended") {
          data[key].attended += 1;
        }
      }
    });
    return Object.values(data).sort((a, b) => a.date.localeCompare(b.date));
  })();

  // Prepare Weekly Series (last 12 weeks maybe? or from all data?)
  // Let's stick to simple weekly aggregation from recent data or all data?
  // Original code logic:
  const weeklySeries = (() => {
    // Group by week
    const data: Record<string, { weekLabel: string; bookings: number; attended: number; sortKey: string }> = {};

    bookings.forEach(b => {
      const d = new Date(b.created_at);
      // Get week start (Monday)
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(d.setDate(diff));
      const key = weekStart.toISOString().slice(0, 10);

      if (!data[key]) {
        data[key] = {
          weekLabel: weekStart.toLocaleDateString("uk-UA", { month: "short", day: "numeric" }),
          bookings: 0,
          attended: 0,
          sortKey: key,
        };
      }
      data[key].bookings += 1;
      if (b.status === "attended") {
        data[key].attended += 1;
      }
    });

    // Take last 8 weeks
    return Object.values(data)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-8);
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/60 border-white/10">
          <CardContent className="p-6 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Відвідано всього</p>
            <p className="text-3xl font-bold">{attendedBookings.length}</p>
            <p className="text-xs text-muted-foreground">З {bookings.length} усіх бронювань</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6 space-y-1">
            <p className="text-sm font-medium text-emerald-500">Загальна відвідуваність</p>
            <p className="text-3xl font-bold text-emerald-500">{attendanceRate}%</p>
            <p className="text-xs text-emerald-500/80">
              Відношення “відвідано” до всіх
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-6 space-y-1">
            <p className="text-sm font-medium text-blue-500">За останні 30 днів</p>
            <p className="text-3xl font-bold text-blue-500">
              {recentAttendedBookings.length} / {recentBookings.length}
            </p>
            <p className="text-xs text-blue-500/80">
              Відвідано / всі бронювання ({recentAttendanceRate}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-card/60 border-white/10">
          <CardHeader>
            <CardTitle>Динаміка за днями (30 днів)</CardTitle>
          </CardHeader>
          <CardContent>
            {dailySeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Поки що немає бронювань за останні 30 днів.</p>
            ) : (
              <ChartContainer config={attendanceChartConfig} className="mt-2 min-h-[300px] w-full">
                <RechartsPrimitive.AreaChart data={dailySeries}>
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <RechartsPrimitive.XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={value => {
                      const date = new Date(value);
                      return date.toLocaleDateString("uk-UA", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <RechartsPrimitive.YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--color-bookings)"
                    fill="var(--color-bookings)"
                    fillOpacity={0.2}
                  />
                  <RechartsPrimitive.Area
                    type="monotone"
                    dataKey="attended"
                    stroke="var(--color-attended)"
                    fill="var(--color-attended)"
                    fillOpacity={0.3}
                  />
                </RechartsPrimitive.AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-white/10">
          <CardHeader>
            <CardTitle>Динаміка за тижнями</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklySeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Недостатньо даних для тижневої статистики.</p>
            ) : (
              <ChartContainer config={attendanceChartConfig} className="mt-2 min-h-[300px] w-full">
                <RechartsPrimitive.BarChart data={weeklySeries}>
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <RechartsPrimitive.XAxis
                    dataKey="weekLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10 }}
                  />
                  <RechartsPrimitive.YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Bar
                    dataKey="bookings"
                    fill="var(--color-bookings)"
                    radius={4}
                  />
                  <RechartsPrimitive.Bar
                    dataKey="attended"
                    fill="var(--color-attended)"
                    radius={4}
                  />
                </RechartsPrimitive.BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
