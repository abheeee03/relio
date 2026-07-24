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
        websites: {
          select: {
            id: true,
            url: true,
            ticks: {
              select: {
                status: true,
                response_ms: true,
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
    return NextResponse.json("something went wrong");
  }
}
