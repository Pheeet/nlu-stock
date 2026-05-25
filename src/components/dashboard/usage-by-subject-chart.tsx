"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

interface UsageBySubjectData {
  subjectCode: string;
  subjectName: string;
  totalQuantity: number;
}

interface UsageBySubjectChartProps {
  data: UsageBySubjectData[];
}

export function UsageBySubjectChart({ data }: UsageBySubjectChartProps) {
  const chartData = data.map((d) => ({
    name: d.subjectName.length > 15 ? d.subjectName.slice(0, 13) + "…" : d.subjectName,
    totalQuantity: d.totalQuantity,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Usage by Subject This Month
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data this month</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
