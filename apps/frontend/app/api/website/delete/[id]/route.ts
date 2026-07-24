import { NextResponse } from "next/server";
import prisma from "store/client";
import { isNextResponse, requireAuth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("req come to delete");

  const userIdOrError = requireAuth(req);
  if (isNextResponse(userIdOrError)) {
    return userIdOrError;
  }
  const userId = userIdOrError;
  const { id: websiteID } = await params;

  try {
    await prisma.websites.delete({
      where: {
        id: websiteID,
        user_id: userId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        err,
        msg: "something wrong",
      },
      { status: 400 }
    );
  }
}
