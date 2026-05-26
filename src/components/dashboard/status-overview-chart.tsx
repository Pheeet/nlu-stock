"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

const STATUS_VAR_MAP: Record<string, string> = {
  AVAILABLE: "--chart-2",
  CHECKED_OUT: "--chart-1",
  DAMAGED: "--chart-4",
  UNDER_REPAIR: "--chart-3",
  LOST: "--chart-5",
  PENDING_MAINTENANCE: "--chart-5",
  DISPOSED: "--muted",
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

function resolveToHex(cssVar: string): string {
  if (typeof window === "undefined") return "#888";
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!raw) return "#888";
  if (raw.startsWith("#")) return raw;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return "#888";
  ctx.fillStyle = raw;
  return ctx.fillStyle;
}

interface StatusData {
  status: string;
  count: number;
}

interface StatusOverviewChartProps {
  data: StatusData[];
}

export function StatusOverviewChart({ data }: StatusOverviewChartProps) {
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [status, cssVar] of Object.entries(STATUS_VAR_MAP)) {
      map[status] = resolveToHex(cssVar);
    }
    return map;
  }, []);

  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    status: d.status,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={colorMap[entry.status] || colorMap["DISPOSED"]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1 w-full px-2">
              {chartData.map((entry) => (
                <li key={entry.status} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: colorMap[entry.status] || colorMap["DISPOSED"] }}
                  />
                  <span className="truncate text-foreground/80">{entry.name}</span>
                  <span className="text-foreground font-semibold ml-auto">{entry.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
