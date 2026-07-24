import { NextResponse } from "next/server";
import prisma from "store/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    const response = await prisma.region.create({
      data: {
        name,
      },
    });

    if (!response) {
      return NextResponse.json({
        error: "error while adding region",
      });
    }

    return NextResponse.json({
      data: response,
      msg: "region added successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "error while adding region",
    });
  }
}
