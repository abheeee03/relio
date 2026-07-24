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
    const { url } = body;

    console.log("Req recieved for ", url, " and for userId: ", userId);

    if (!url) {
      return NextResponse.json({
        error: "url is req",
      });
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
    return NextResponse.json({
      error: "something went wrong",
    });
  }
}
