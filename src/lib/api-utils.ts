import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ZodSchema, ZodError } from "zod";

type SessionUser = { userId: string; email: string; name: string; role: string };
type AuthResult = { user: SessionUser; denied: null } | { user: null; denied: NextResponse };

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const user = await getSessionUser();
  if (!user) return { user: null, denied: unauthorized() };
  return { user, denied: null };
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const result = await requireAuth(request);
  if (result.denied) return result;
  if (result.user.role !== "ADMIN") return { user: null, denied: forbidden() };
  return result;
}

export function parseBody<T>(schema: ZodSchema<T>) {
  return async (request: Request): Promise<{ data: T | null; error: NextResponse | null }> => {
    try {
      const body = await request.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (e) {
      if (e instanceof ZodError) {
        return { data: null, error: NextResponse.json({ error: e.flatten().fieldErrors }, { status: 422 }) };
      }
      return { data: null, error: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
    }
  };
}

export function getSearchParams(request: NextRequest) {
  return request.nextUrl.searchParams;
}

export function paginate(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage")) || 20));
  const skip = (page - 1) * perPage;
  return { page, perPage, skip, take: perPage };
}
