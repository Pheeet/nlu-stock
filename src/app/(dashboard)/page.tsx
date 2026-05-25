import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { StatusOverviewWidget } from "@/components/dashboard/status-overview-widget";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

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
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:col-span-3">
          <DashboardMetricCard
            title="Low Stock"
            value={lowStock}
            iconName="AlertTriangle"
            color="text-orange-500"
            href="/items?lowStock=true"
          />
          <DashboardMetricCard
            title="Near Expiry"
            value={nearExpiry}
            iconName="Package"
            color="text-blue-500"
            href="/items?nearExpiry=true"
          />
          <DashboardMetricCard
            title="Overdue Maintenance"
            value={overdueMaint}
            iconName="Wrench"
            color="text-red-500"
            href="/items?overdueMaint=true"
          />
        </div>
        <div className="lg:col-span-2">
          <StatusOverviewWidget />
        </div>
      </div>

      <DashboardCharts />
    </div>
  );
}
