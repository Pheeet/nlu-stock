"use client";

import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronsLeft, ChevronLeftIcon, ChevronRightIcon, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("ellipsis");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <PaginationNav className="mt-3 border-t pt-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            size="icon"
            className="cursor-pointer"
            onClick={() => onChange(1)}
            aria-label="First page"
          >
            <ChevronsLeft className="size-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            size="icon"
            className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            onClick={() => page > 1 && onChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                className="cursor-pointer"
                onClick={() => onChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            size="icon"
            className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
            onClick={() => page < totalPages && onChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            size="icon"
            className="cursor-pointer"
            onClick={() => onChange(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  );
}
