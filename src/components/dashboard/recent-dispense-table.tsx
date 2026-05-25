"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface RecentDispenseRecord {
  id: string;
  dispensedAt: string;
  quantity: number;
  item: { id: string; code: string; name: string };
  staff: { name: string };
  subject: { name: string; code: string } | null;
}

interface RecentDispenseTableProps {
  data: RecentDispenseRecord[];
}

export function RecentDispenseTable({ data }: RecentDispenseTableProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Dispense
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No records</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/items/${r.item.id}`)}
                  >
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(r.dispensedAt), "dd MMM HH:mm")}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="font-mono">{r.item.code}</span>{" "}
                      <span className="hidden sm:inline">{r.item.name}</span>
                    </TableCell>
                    <TableCell className="text-right text-sm">{r.quantity}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{r.staff.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {r.subject?.name ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
