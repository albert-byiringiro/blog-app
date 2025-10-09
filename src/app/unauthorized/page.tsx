import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription className="text-base">
                You don't have permission to access this page
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              This page requires specific permissions that your account doesn't currently have.
            </p>
            <p className="text-muted-foreground">
              If you believe you should have access to this content, please contact an 
              administrator for assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}