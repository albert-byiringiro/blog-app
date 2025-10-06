import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getPostBySlug } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params

  const post = await getPostBySlug(slug)

  // If post not found, show 404 page
  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex gap-4">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            ← Back to Blog
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/blog/${post.slug}/edit`}>
            Edit Post
          </Link>
        </Button>
      </div>

      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Badge variant={post.published ? 'default' : 'secondary'}>
            {post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-muted-foreground">
          <span>By {post.author?.name || 'Unknown'}</span>
          <Separator orientation="vertical" className="h-4" />
          <time dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <Separator />
      </header>

      <Card>
        <CardContent className="prose prose-gray dark:prose-invert max-w-none pt-6">
          <div className="whitespace-pre-wrap">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {post.author && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  )
}