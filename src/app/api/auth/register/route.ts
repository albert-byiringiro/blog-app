import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, role } = body

        if (!email || !password || !name) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email format',
                },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                success: false,
                error: 'Invalid email format',
                },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                success: false,
                error: 'Password too short',
                message: 'Password must be at least 6 characters long',
                },
                { status: 400 }
            )
        }

        if (role && !['AUTHOR', 'READER'].includes(role)) {
            return NextResponse.json(
                {
                success: false,
                error: 'Invalid role',
                message: 'Role must be either AUTHOR or READER',
                },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                {
                success: false,
                error: 'Email already registered',
                message: 'An account with this email already exists',
                },
                { status: 409 } // 409 = Conflict
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || Role.READER,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        })

        // TODO: Send verification email
        // For now, we'll just log to console
        console.log('\n📧 EMAIL VERIFICATION REQUIRED')
        console.log('================================')
        console.log(`To: ${newUser.email}`)
        console.log(`Subject: Verify your email`)
        console.log(`\nVerification link: http://localhost:3000/auth/verify?token=mock-token-${newUser.id}`)
        console.log('================================\n')

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful! Please check your email to verify your account.',
                data: {
                user: newUser,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Registration error:', error)

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to register user',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}