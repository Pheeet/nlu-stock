"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Wrench } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle,
  Package,
  Wrench,
};

interface DashboardMetricCardProps {
  title: string;
  value: number;
  iconName: string;
  color: string;
  href?: string;
}

export function DashboardMetricCard({ title, value, iconName, color, href }: DashboardMetricCardProps) {
  const router = useRouter();
  const Icon = ICON_MAP[iconName];

  return (
    <Card
      className={href ? "cursor-pointer transition-shadow hover:shadow-md" : undefined}
      onClick={href ? () => router.push(href) : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${color}`} />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
