// src/app/blog/[slug]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getPostBySlug } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { DeletePostButton } from '@/components/delete-post-button'
import { canEditPost, getOptionalUser } from '@/lib/auth-utils'
import { Info } from 'lucide-react'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  
  // Get current user
  const user = await getOptionalUser()
  
  // First, try to get the post including unpublished ones
  const post = await getPostBySlug(slug, true)

  if (!post) {
    notFound()
  }

  // Check if user can edit this post (own post or admin)
  const userCanEdit = await canEditPost(post.authorId)

  // If post is not published, check if user has permission to view it
  if (!post.published && !userCanEdit) {
    // Post exists but is a draft and user doesn't have permission
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Draft Alert - Only shown for unpublished posts */}
      {!post.published && (
        <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Draft:</strong> This post is not published yet. Only you can see it.
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons for post owners */}
      {userCanEdit && (
        <div className="mb-8 flex flex-wrap gap-4">
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
          <DeletePostButton postId={post.id} postTitle={post.title} />
        </div>
      )}

      {/* Public users just see back button */}
      {!userCanEdit && (
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              ← Back to Blog
            </Link>
          </Button>
        </div>
      )}

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
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">About the Author</h3>
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