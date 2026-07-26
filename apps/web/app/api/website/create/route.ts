import { NextResponse } from "next/server";
import prisma from "store/client";
import { isNextResponse, requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;

  try {
    const body = await req.json();
    let { url } = body as { url?: string };

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "invalid url" }, { status: 400 });
    }

    const response = await prisma.websites.create({
      data: {
        user_id: userId,
        url,
      },
    });

    return NextResponse.json({
      data: response,
      msg: "website created successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
