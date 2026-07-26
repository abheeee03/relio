import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/** Exchange a Better Auth session for a legacy JWT used by existing API routes. */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: session.user.id },
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to issue session token" },
      { status: 500 }
    );
  }
}
