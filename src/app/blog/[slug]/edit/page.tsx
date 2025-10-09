// src/app/blog/[slug]/edit/page.tsx

import { EditPostForm } from "@/components/edit-post-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPostBySlug } from "@/lib/posts"
import { notFound, redirect } from "next/navigation"
import { canEditPost } from "@/lib/auth-utils"

type PageProps = {
    params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: PageProps) {
    const { slug } = await params

    // Include unpublished posts when editing
    const post = await getPostBySlug(slug, true)

    if (!post) {
        notFound()
    }

    // Check if user has permission to edit this post
    const hasPermission = await canEditPost(post.authorId)
    
    if (!hasPermission) {
        redirect('/unauthorized')
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Edit Post</CardTitle>
                    <CardDescription>
                        Update your blog post details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditPostForm post={post}/>
                </CardContent>
            </Card>
        </div>
    )
}