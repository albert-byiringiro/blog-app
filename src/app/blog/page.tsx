// src/app/blog/page.tsx

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { getPosts } from '@/lib/posts'
import { SearchInput } from '@/components/search-input'
import { PaginationControls } from '@/components/pagination-controls'
import { getOptionalUser } from '@/lib/auth-utils'

type PageProps = {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query || ''
  const page = parseInt(params.page || '1')

  const { posts, pagination } = await getPosts(query, page)
  
  // Check if user is authenticated and can create posts
  const user = await getOptionalUser()
  const canCreatePosts = user && (user.role === 'AUTHOR' || user.role === 'ADMIN')

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-xl text-muted-foreground">
          Explore articles, tutorials, and thoughts
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 max-w-md">
          <SearchInput />
        </div>
        {/* Only show Create Post button if user can create posts */}
        {canCreatePosts && (
          <Button asChild>
            <Link href="/blog/create">Create New Post</Link>
          </Button>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Search Results Info */}
      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          Found {posts.length} result{posts.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {query
                ? `No posts found matching "${query}"`
                : 'No blog posts available yet. Check back soon!'}
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
                    <Badge variant="default">
                      Published
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
      
      <PaginationControls 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasMore={pagination.hasMore}
      />
    </div>
  )
}