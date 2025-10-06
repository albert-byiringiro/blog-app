import { EditPostForm } from "@/components/edit-post-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPostBySlug } from "@/lib/posts"
import { notFound } from "next/navigation"

type PageProps = {
    params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: PageProps) {
    const { slug } = await params

    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
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