import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "store/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({
        error: "username and password is req",
      });
    }

    const response = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!response) {
      return NextResponse.json({
        error: "user not found",
      });
    }

    if (response.password != password) {
      return NextResponse.json({
        erorr: "invalid id or pass",
      });
    }

    const token = jwt.sign(
      { userId: response.id },
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({
      token,
      msg: "user is valid",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "something went wrong",
    });
  }
}
