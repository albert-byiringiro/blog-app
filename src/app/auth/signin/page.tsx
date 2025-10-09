import { SignInForm } from '@/components/signin-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions)
  
  // Redirect to dashboard if already authenticated
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Blog App
        </Link>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Sign in to your account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}