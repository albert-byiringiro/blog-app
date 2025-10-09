import { CreatePostForm } from '@/components/create-post-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireRole } from '@/lib/auth-utils'
import { Role } from '@prisma/client'

export default async function CreatePostPage() {
  // Require AUTHOR or ADMIN role
  await requireRole(Role.AUTHOR)

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create New Post</CardTitle>
          <CardDescription>
            Fill out the form below to create a new blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePostForm />
        </CardContent>
      </Card>
    </div>
  )
}