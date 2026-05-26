"use client";

import { useSession } from "@/components/layout/auth-guard";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "สวัสดีตอนเช้า";
  if (h < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

export function DashboardGreeting() {
  const { user } = useSession();
  const greeting = getGreeting();
  const firstName = user?.name?.split(" ")[0] ?? "ผู้ใช้งาน";

  return (
    <div className="mb-6">
      <h1 className="text-2xl flex items-baseline gap-2 flex-wrap">
        <span className="font-normal text-muted-foreground">{greeting}, </span>
        <span className="font-bold text-foreground">{firstName}</span>
        <span className="text-sm font-normal text-muted-foreground">
          — นี่คือสถานะสต๊อกล่าสุดประจำวันนี้
        </span>
      </h1>
    </div>
  );
}
