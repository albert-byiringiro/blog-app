import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = {
    params: Promise<{ id: string }>
}

// Helper function to get and validate the post ID
async function getPostId(context: RouteContext): Promise<string | null> {
    try {
        const params = await context.params
        const id = params.id

        const objectIdRegex = /^[a-f\d]{24}$/i
        if (!objectIdRegex.test(id)) {
            return null
        }

        return id
    } catch (error) {
        return null
    }
}

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const id = await getPostId(context)

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid post ID format',
                    message: 'Post ID must be a valid MongoDB ObjectId',
                },
                { status: 400 }
            )
        }

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Post not found',
                    message: `No post found with ID: ${id}`,
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: post,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching post:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch post',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
        
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const id = await getPostId(context)

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid post ID format',
                },
                { status: 400 }
            )
        }

        const body = await request.json()

        const { title, content, excerpt, published } = body

        if (!title && !content && excerpt === undefined && published === undefined) {
            return NextResponse.json(
                {
                success: false,
                error: 'No update fields provided',
                message: 'Provide at least one field to update',
                allowedFields: ['title', 'content', 'excerpt', 'published'],
                },
                { status: 400 }
            )
        }

        const existingPost = await prisma.post.findUnique({
            where: { id }
        })

        if (!existingPost) {
            return NextResponse.json(
                {
                success: false,
                error: 'Post not found',
                message: `No post found with ID: ${id}`,
                },
                { status: 404 }
            )
        }

        // Build update data object
        const updateData: any = {}

        if (title !== undefined) updateData.title = title
        if (content !== undefined) updateData.content = content
        if (excerpt !== undefined) updateData.excerpt = excerpt
        if (published !== undefined) updateData.published = published

        const updatedPost = await prisma.post.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Post updated successfully',
                data: updatedPost
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error updating post:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update post',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const id = await getPostId(context)

        if (!id) {
            return NextResponse.json(
                {
                success: false,
                error: 'Invalid post ID format',
                },
                { status: 400 }
            )
        }

        // Check if post exists before deleting
        const existingPost = await prisma.post.findUnique({
            where: { id },  
        })

        if (!existingPost) {
            return NextResponse.json(
                {
                success: false,
                error: 'Post not found',
                message: `No post found with ID: ${id}`,
                },
                { status: 404 }
            )
        }

        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Post deleted successfully',
                data: {
                    id,
                    title: existingPost.title,
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting post:', error)

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete post',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}