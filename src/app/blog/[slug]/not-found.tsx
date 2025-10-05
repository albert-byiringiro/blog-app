import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Post Not Found</CardTitle>
          <CardDescription>
            The blog post you're looking for doesn't exist or has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/blog">
              Return to Blog
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}