"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface RecentReceiveRecord {
  id: string;
  receivedAt: string;
  quantity: number;
  item: { id: string; code: string; name: string };
  receiver: { name: string };
}

interface RecentReceiveTableProps {
  data: RecentReceiveRecord[];
}

export function RecentReceiveTable({ data }: RecentReceiveTableProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Receive
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
                  <TableHead className="hidden sm:table-cell">Receiver</TableHead>
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
                      {format(new Date(r.receivedAt), "dd MMM HH:mm")}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="font-mono">{r.item.code}</span>{" "}
                      <span className="hidden sm:inline">{r.item.name}</span>
                    </TableCell>
                    <TableCell className="text-right text-sm">{r.quantity}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{r.receiver.name}</TableCell>
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
