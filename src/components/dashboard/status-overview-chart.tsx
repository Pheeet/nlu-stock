"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "hsl(var(--chart-2))",
  CHECKED_OUT: "hsl(var(--chart-1))",
  DAMAGED: "hsl(var(--chart-4))",
  UNDER_REPAIR: "hsl(var(--chart-3))",
  LOST: "hsl(var(--chart-5))",
  PENDING_MAINTENANCE: "hsl(var(--chart-5))",
  DISPOSED: "hsl(var(--muted))",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  CHECKED_OUT: "Checked Out",
  DAMAGED: "Damaged",
  UNDER_REPAIR: "Under Repair",
  LOST: "Lost",
  PENDING_MAINTENANCE: "Pending Maint.",
  DISPOSED: "Disposed",
};

interface StatusData {
  status: string;
  count: number;
}

interface StatusOverviewChartProps {
  data: StatusData[];
}

export function StatusOverviewChart({ data }: StatusOverviewChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    status: d.status,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
