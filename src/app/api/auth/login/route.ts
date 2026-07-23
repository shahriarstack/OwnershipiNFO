import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { createPool } from "mariadb";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

const connectionString = process.env.DATABASE_URL || "mysql://user:pass@localhost:3306/db";

const initPrisma = () => {
  try {
    const pool = createPool(connectionString);
    const adapter = new PrismaMariaDb(pool as any);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma client", error);
    throw error;
  }
};

const prisma = initPrisma();

export async function POST(request: Request) {
  try {
    const { identifier, password, role } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { staffId: identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (role && user.role !== role) {
      return NextResponse.json(
        { error: "Invalid role for this user." },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      staffId: user.staffId,
      name: user.name,
      role: user.role,
      territory: user.territory,
      area: user.area,
      areaCode: user.areaCode,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        staffId: user.staffId,
        name: user.name,
        role: user.role,
        territory: user.territory,
        area: user.area,
        areaCode: user.areaCode,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
