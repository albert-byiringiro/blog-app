// src/components/posts-tabs-client.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { DeletePostButton } from '@/components/delete-post-button'
import { formatDate } from '@/lib/utils'
import { 
  Plus, 
  Eye, 
  Edit, 
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  author: {
    name: string | null
    email: string
  } | null
}

type PostsTabsClientProps = {
  posts: Post[]
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={post.published ? 'default' : 'secondary'}>
                {post.published ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <CardTitle className="line-clamp-2 text-lg">
              <Link 
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </CardTitle>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {post.excerpt || 'No excerpt'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </span>
          {post.createdAt !== post.updatedAt && (
            <span className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              Updated {formatDate(post.updatedAt)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/blog/${post.slug}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/blog/${post.slug}/edit`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
        <DeletePostButton postId={post.id} postTitle={post.title} />
      </CardFooter>
    </Card>
  )
}

function EmptyState({ type }: { type: 'all' | 'published' | 'draft' }) {
  const messages = {
    all: {
      title: 'No posts yet',
      description: 'Start creating content to see it here',
    },
    published: {
      title: 'No published posts yet',
      description: 'Publish your first post to see it here',
    },
    draft: {
      title: 'No drafts yet',
      description: 'Start writing and save as draft to see it here',
    },
  }

  const message = messages[type]

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4 py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">{message.title}</p>
            <p className="text-sm text-muted-foreground">
              {message.description}
            </p>
          </div>
          <Button asChild>
            <Link href="/blog/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PostsTabsClient({ posts }: PostsTabsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const publishedPosts = posts.filter(p => p.published)
  const draftPosts = posts.filter(p => !p.published)

  const filterPosts = (postsToFilter: Post[]) => {
    if (!searchQuery) return postsToFilter
    const query = searchQuery.toLowerCase()
    return postsToFilter.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query)
    )
  }

  const filteredAllPosts = filterPosts(posts)
  const filteredPublished = filterPosts(publishedPosts)
  const filteredDrafts = filterPosts(draftPosts)

  return (
    <>
      {/* Search and Create Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/blog/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftPosts.length})
          </TabsTrigger>
        </TabsList>

        {/* All Posts Tab */}
        <TabsContent value="all" className="space-y-4">
          {filteredAllPosts.length === 0 ? (
            searchQuery ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No posts found matching "{searchQuery}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <EmptyState type="all" />
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAllPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Published Posts Tab */}
        <TabsContent value="published" className="space-y-4">
          {filteredPublished.length === 0 ? (
            searchQuery ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No published posts found matching "{searchQuery}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <EmptyState type="published" />
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPublished.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Draft Posts Tab */}
        <TabsContent value="drafts" className="space-y-4">
          {filteredDrafts.length === 0 ? (
            searchQuery ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No drafts found matching "{searchQuery}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <EmptyState type="draft" />
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDrafts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}