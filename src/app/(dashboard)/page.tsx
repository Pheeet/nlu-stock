import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { StatusOverviewWidget } from "@/components/dashboard/status-overview-widget";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardBarCharts } from "@/components/dashboard/dashboard-bar-charts";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";

export default async function DashboardPage() {
  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const [lowStockRows, nearExpiry, overdueMaint] = await Promise.all([
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) FROM items WHERE "availableQty" < "minThreshold" AND "isActive" = true
    `,
    prisma.lot.count({
      where: { expiryDate: { gte: now, lte: in90Days } },
    }),
    prisma.item.count({
      where: { nextMaintenanceDate: { lt: now }, isActive: true },
    }),
  ]);

  const lowStock = Number(lowStockRows[0]?.count ?? 0);

  return (
    <div className="space-y-6">
      <DashboardGreeting />
      <div className="grid gap-4 lg:grid-cols-5 items-stretch">
        {/* 3 metric cards stacked vertically */}
        <div className="flex flex-col gap-3">
          <DashboardMetricCard
            title="Low Stock"
            value={lowStock}
            subtitle={lowStock > 0 ? "below min threshold" : undefined}
            iconName="AlertTriangle"
            color="text-orange-500"
            href="/items?lowStock=true"
            className="flex-1"
          />
          <DashboardMetricCard
            title="Near Expiry"
            value={nearExpiry}
            subtitle={nearExpiry > 0 ? "expiring within 90 days" : undefined}
            iconName="Package"
            color="text-blue-500"
            href="/items?nearExpiry=true"
            className="flex-1"
          />
          <DashboardMetricCard
            title="Overdue Maintenance"
            value={overdueMaint}
            subtitle={overdueMaint > 0 ? "past due date" : undefined}
            iconName="Wrench"
            color="text-red-500"
            href="/items?overdueMaint=true"
            className="flex-1"
          />
        </div>

        {/* 2 bar charts */}
        <div className="lg:col-span-4">
          <DashboardBarCharts />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <DashboardCharts />
        </div>
        <div className="lg:col-span-1">
          <StatusOverviewWidget />
        </div>
      </div>
    </div>
  );
}
