import { m } from "@/paraglide/messages";
import { authAtom } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai/react";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple line chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80, tab: 100 },
  { month: "February", desktop: 305, mobile: 200, tab: 190 },
  { month: "March", desktop: 237, mobile: 120, tab: 130 },
  { month: "April", desktop: 73, mobile: 190, tab: 250 },
  { month: "May", desktop: 209, mobile: 130, tab: 315 },
  { month: "June", desktop: 214, mobile: 140, tab: 15 },
  { month: "July", desktop: 133, mobile: 125, tab: 117 },
  { month: "August", desktop: 314, mobile: 222, tab: 180 },
  { month: "September", desktop: 374, mobile: 12, tab: 123 },
  { month: "October", desktop: 231, mobile: 114, tab: 167 },
  { month: "November", desktop: 115, mobile: 231, tab: 235 },
  { month: "December", desktop: 122, mobile: 22, tab: 345 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tab: {
    label: "Tab",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: m["dashboard.page title"](),
      },
    ],
  }),
});

export function RouteComponent() {
  const [auth] = useAtom(authAtom);

  if (!auth) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Card className="w-5xl mx-auto my-8">
      <CardHeader className="text-center">
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 24,
              right: 24,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={3}
              dot={true}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={3}
              dot={true}
            />
            <Line
              dataKey="tab"
              type="monotone"
              stroke="var(--color-tab)"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
