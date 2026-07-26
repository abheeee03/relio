import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "store/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

// ---------------------------------------------------------------------------
// Legacy JWT helpers (used by existing /api routes). Prefer Better Auth
// sessions via `auth.api.getSession` for new code.
// ---------------------------------------------------------------------------

export function getUserIdFromRequest(req: Request): string | null {
  const headers = req.headers.get("authorization");
  if (!headers) {
    return null;
  }

  try {
    const decoded = jwt.verify(headers, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "headers not present" }, { status: 401 });
}

export function forbiddenResponse() {
  return new NextResponse("", { status: 403 });
}

/** Returns userId or an error NextResponse if auth fails. */
export function requireAuth(req: Request): string | NextResponse {
  const headers = req.headers.get("authorization");
  if (!headers) {
    return unauthorizedResponse();
  }

  try {
    const decoded = jwt.verify(headers, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return forbiddenResponse();
  }
}

export function isNextResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
