import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const authorId = searchParams.get('authorId')
    const search = searchParams.get('search')

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const skip = (page - 1) * limit

    const where: any = {}

    // Add published filter if provided
    if (published !== null) {
      where.published = published === 'true'
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (search && search.trim()) {
      const searchTerm = search.trim()

      const words = searchTerm.split(/\s+/).filter(w => w.length > 0)

      if (words.length === 1) {
        where.OR = [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
          { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        ]
      } else {
        where.AND = [
          {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { content: { contains: searchTerm, mode: 'insensitive' } },
              { excerpt: { contains: searchTerm, mode: 'insensitive' } },
            ]
          },
          ...words.map(word => ({
            OR: [
              { title: { contains: word, mode: 'insensitive' } },
              { content: { contains: word, mode: 'insensitive' } },
              { excerpt: { contains: word, mode: 'insensitive' } },
            ]
          }))
        ]
      }
    }

    const totalCount = await prisma.post.count({ where })

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
      orderBy: search
      ? [
        // When searching, prioritize title matches
        { title: 'asc'},
        { createdAt: 'desc'},
      ] : { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json(
      {
        success: true,
        count: posts.length,
        data: posts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages
        }
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