import { RegisterForm } from '@/components/register-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold">
          Blog App
        </Link>
        <p className="mt-2 text-muted-foreground">
          Create your account to get started
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}