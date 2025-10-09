import { getCurrentUser } from "./auth-utils"
import { prisma } from "./prisma"

export async function getPostBySlug(slug: string, includeUnpublished: boolean = false) {
  try {
    const url = new URL('http://localhost:3000/api/posts')
    
    // Add includeUnpublished parameter if needed
    if (includeUnpublished) {
      url.searchParams.set('includeUnpublished', 'true')
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    const posts = result.data || []

    // Find the post with matching slug
    const post = posts.find((p: any) => p.slug === slug)
    
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

/**
 * Get posts with optional filters
 * @param query - Search query
 * @param page - Page number
 * @param includeUnpublished - Include draft posts (for authenticated users)
 */
export async function getPosts(
  query?: string, 
  page: number = 1,
  includeUnpublished: boolean = false
) {
  try {
    const url = new URL('http://localhost:3000/api/posts')
    
    // Add includeUnpublished parameter if needed
    if (includeUnpublished) {
      url.searchParams.set('includeUnpublished', 'true')
    }
    
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '9')
    
    if (query) {
      url.searchParams.set('search', query)
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const result = await response.json()

    return {
      posts: result.data || [],
      pagination: result.pagination || { 
        page: 1, 
        totalPages: 0, 
        hasMore: false,
        totalCount: 0,
        limit: 9
      },
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      pagination: { 
        page: 1, 
        totalPages: 0, 
        hasMore: false,
        totalCount: 0,
        limit: 9
      },
    }
  }
}

export async function getCurrentUserPosts() {
  const user = await getCurrentUser()

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    const publishedPosts = posts.filter(p => p.published)
    const draftPosts = posts.filter(p => !p.published)
    const totalViews = 0 // TODO: Implement view tracking

    const serializedPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))

    return {
      published: publishedPosts,
      drafts: draftPosts,
      views: totalViews, 
      posts: serializedPosts, 
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      published: [],
      drafts: [],
      views: 0,
    }
  }
}