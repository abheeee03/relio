import { NextResponse } from "next/server";
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

    const response = await prisma.user.create({
      data: {
        username,
        password,
        // Better Auth requires email; legacy signup still uses username/password.
        email: `${username}@users.local`,
        name: username,
        displayUsername: username,
      },
    });

    if (!response) {
      return NextResponse.json({
        error: "something went wrong",
      });
    }

    return NextResponse.json({
      data: response,
      msg: "Success",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "something went wrong",
    });
  }
}
