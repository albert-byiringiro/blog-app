// src/app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, getOptionalUser } from '@/lib/auth-utils'

/**
 * GET /api/posts
 * PUBLIC - Anyone can read published posts
 * AUTHENTICATED - Authors can see their own drafts
 * Returns filtered list based on query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const authorId = searchParams.get('authorId')
    const search = searchParams.get('search')
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const skip = (page - 1) * limit

    const where: any = {}

    // Handle published filter
    if (published !== null) {
      // Explicit published parameter provided
      where.published = published === 'true'
    } else if (!includeUnpublished) {
      // No explicit parameter and not requesting unpublished
      // Default to published only for public access
      where.published = true
    }
    // If includeUnpublished=true and no published param, don't filter by published

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
            { title: 'asc' },
            { createdAt: 'desc' },
          ]
        : { createdAt: 'desc' },
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

/**
 * POST /api/posts
 * PROTECTED - Requires authentication (AUTHOR or ADMIN)
 * Creates a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You do not have permission to create posts',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, slug, content, excerpt, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['title', 'slug', 'content'],
        },
        { status: 400 }
      )
    }

    // Validate slug format
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
        { status: 409 }
      )
    }

    // Create post with authenticated user as author
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        published: published || false,
        authorId: user.id,
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
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to create posts',
        },
        { status: 401 }
      )
    }

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