import { NextResponse } from "next/server";
import prisma from "store/client";
import { auth, isNextResponse, requireAuth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Prefer Better Auth when a session cookie is present
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.id === userId) {
        await auth.api.changePassword({
          body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: false,
          },
          headers: await headers(),
        });
        return NextResponse.json({ msg: "Password updated" });
      }
    } catch {
      // Fall through to legacy password update
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Legacy accounts store a plain password on User
    if (user.password != null && user.password !== currentPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    return NextResponse.json({ msg: "Password updated" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
