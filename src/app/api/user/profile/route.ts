import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message || "Invalid inputs" },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
