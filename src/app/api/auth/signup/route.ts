import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message || "Invalid inputs" },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        // @ts-ignore
        password: hashedPassword,
      },
    });

    // Remove password from response
    // @ts-ignore
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
