import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, email, password, name } = body;

    // Validate required fields
    if (!mode || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: mode, email, password' },
        { status: 400 }
      );
    }

    if (mode !== 'login' && mode !== 'register') {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be "login" or "register"' },
        { status: 400 }
      );
    }

    if (mode === 'register') {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password and create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await db.user.create({
        data: {
          email,
          name: name || null,
          password: hashedPassword,
        },
      });

      return NextResponse.json({
        success: true,
        userId: user.id,
      });
    }

    if (mode === 'login') {
      // Find user by email
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        userId: user.id,
      });
    }

    // Should never reach here, but TypeScript safety
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
