import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,    
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'Password' }
            },
            // User signs in → authorize() validates credentials
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password.")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    throw new Error('No user found with this email')
                }

                if (!user.password) {
                    throw new Error('Please sign in with your social account')
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error('Incorrect password')
                }

                if (!user.emailVerified) {
                    throw new Error('Please verify your email before signing in')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        // signUp: '/auth/signUp',
        // error: '/auth/error',
    },
    callbacks: {
        // jwt() callback adds data to token
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }

            // If session was updated (e.g., user changed profile)
            if (trigger === 'update' && session) {
                token.name = session.name
                token.email = session.email
            }

            return token
        },

        // session() callback makes token data available to app
        // components can access session.user
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }

            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET
}