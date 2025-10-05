import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold">Welcome to Our Blog! 🎉</h1>
        
        <p className="text-xl text-muted-foreground">
          A full-stack blog application built with Next.js 15, Prisma, MongoDB, and Shadcn UI.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What you've built so far</CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-2">
            <p className="text-sm">✅ Next.js 15 with App Router</p>
            <p className="text-sm">✅ TypeScript for type safety</p>
            <p className="text-sm">✅ Prisma ORM with MongoDB</p>
            <p className="text-sm">✅ Shadcn UI components</p>
            <p className="text-sm">✅ Server & Client Components</p>
            <p className="text-sm">✅ RESTful API endpoints</p>
            <p className="text-sm">✅ Form validation with Zod</p>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/blog">
              View Blog Posts
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog/create">
              Create Post
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}