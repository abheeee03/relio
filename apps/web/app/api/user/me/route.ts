import { NextResponse } from "next/server";
import prisma from "store/client";
import { isNextResponse, requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;

  try {
    const data = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        displayUsername: true,
        emailVerified: true,
        createdAt: true,
        websites: {
          select: {
            id: true,
            url: true,
            ticks: {
              select: {
                status: true,
                response_ms: true,
                created_at: true,
              },
              orderBy: {
                created_at: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({
      data,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;

  try {
    const body = await req.json();
    const { name, email, image, username } = body as {
      name?: string;
      email?: string;
      image?: string | null;
      username?: string | null;
    };

    const data: {
      name?: string;
      email?: string;
      image?: string | null;
      username?: string | null;
      displayUsername?: string | null;
    } = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      data.name = trimmed;
    }

    if (typeof email === "string") {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed || !trimmed.includes("@")) {
        return NextResponse.json(
          { error: "A valid email is required" },
          { status: 400 }
        );
      }

      const existing = await prisma.user.findFirst({
        where: {
          email: trimmed,
          NOT: { id: userId },
        },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
      data.email = trimmed;
    }

    if (image !== undefined) {
      data.image =
        typeof image === "string" && image.trim() ? image.trim() : null;
    }

    if (username !== undefined) {
      if (username === null || username === "") {
        data.username = null;
        data.displayUsername = null;
      } else if (typeof username === "string") {
        const trimmed = username.trim();
        if (trimmed.length < 3) {
          return NextResponse.json(
            { error: "Username must be at least 3 characters" },
            { status: 400 }
          );
        }
        const existing = await prisma.user.findFirst({
          where: {
            username: trimmed,
            NOT: { id: userId },
          },
          select: { id: true },
        });
        if (existing) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 409 }
          );
        }
        data.username = trimmed;
        data.displayUsername = trimmed;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        displayUsername: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: updated, msg: "Profile updated" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
