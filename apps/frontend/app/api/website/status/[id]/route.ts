import { NextResponse } from "next/server";
import prisma from "store/client";
import { isNextResponse, requireAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;
  const { id: fromWebsiteId } = await params;

  const website = await prisma.websites.findFirst({
    where: {
      user_id: userId,
      id: fromWebsiteId,
    },
    include: {
      ticks: {
        orderBy: [
          {
            created_at: "desc",
          },
        ],
        take: 1,
      },
    },
  });

  if (!website) {
    return NextResponse.json({
      error: "Website not found",
    });
  }

  return NextResponse.json({
    data: website,
  });
}
