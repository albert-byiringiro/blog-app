import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ============================================
// GET /api/posts
// Fetch all blog posts
// ============================================
/**
 * Fetches all blog posts from the database
 * 
 * Query Parameters (optional):
 * - ?published=true - Only fetch published posts
 * - ?authorId=xxx - Only fetch posts by specific author
 * 
 * Example usage:
 * - GET /api/posts → All posts
 * - GET /api/posts?published=true → Only published
 * - GET /api/posts?authorId=123 → Posts by author
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from URL
    // Example: /api/posts?published=true
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const authorId = searchParams.get('authorId')

    // Build Prisma query with filters
    // Start with base query object
    const where: any = {}

    // Add published filter if provided
    if (published !== null) {
      where.published = published === 'true'
    }

    if (authorId) {
      where.authorId = authorId
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      // Order by newest first
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        count: posts.length,
        data: posts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, slug, content, excerpt, published, authorId } = body

    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['title', 'slug', 'content', 'authorId'],
        },
        { status: 400 } // 400 = Bad Request
      )
    }

    // Validate that slug is URL-friendly
    // Only lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid slug format',
          message: 'Slug must contain only lowercase letters, numbers, and hyphens',
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    // Slugs must be unique for URLs
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug already exists',
          message: 'A post with this slug already exists',
        },
        { status: 409 } // 409 = Conflict
      )
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
    })

    if (!author) {
      return NextResponse.json(
        {
          success: false,
          error: 'Author not found',
          message: 'The specified author does not exist',
        },
        { status: 404 }
      )
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        published: published || false,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: newPost,
      },
      { status: 201 } // 201 = Created
    )
  } catch (error) {
    console.error('Error creating post:', error)

    // Check if it's a Prisma unique constraint error
    // This catches any unique field violations we missed
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate entry',
          message: 'A post with this data already exists',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}