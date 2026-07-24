import { NextResponse } from "next/server";
import prisma from "store/client";
import { isNextResponse, requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "15") || 15;
  const offset = parseInt(searchParams.get("offset") || "0") || 0;

  try {
    const userWebsites = await prisma.websites.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        url: true,
      },
    });

    const websiteIds = userWebsites.map((w) => w.id);
    const websiteMap = Object.fromEntries(
      userWebsites.map((w) => [w.id, w.url])
    );

    const ticks = await prisma.ticks.findMany({
      where: {
        website_id: {
          in: websiteIds,
        },
      },
      include: {
        region: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.ticks.count({
      where: {
        website_id: {
          in: websiteIds,
        },
      },
    });

    const ticksWithUrl = ticks.map((tick) => ({
      ...tick,
      websiteUrl: websiteMap[tick.website_id] || "",
    }));

    return NextResponse.json({
      data: ticksWithUrl,
      total: totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}
