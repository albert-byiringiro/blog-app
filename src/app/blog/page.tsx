import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { getPosts } from '@/lib/posts'

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-xl text-muted-foreground">
          Explore our latest articles and tutorials
        </p>
        <Separator />
      </div>

      <div className="mb-8">
        <Button asChild>
          <Link href="/blog/create">
            Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No blog posts yet. Be the first to create one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    By {post.author?.name || 'Unknown'} • {formatDate(post.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-sm text-primary hover:underline">
                    Read more →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}