// src/components/create-post-form.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createFormSchema, CreatePostFormValues } from '@/validations/postSchema'
import { Loader2 } from 'lucide-react'

export function CreatePostForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
    },
  })

  const [manualSlugEdit, setManualSlugEdit] = useState(false)
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    form.setValue('title', value)
    if (!manualSlugEdit) {
      form.setValue('slug', generateSlug(value))
    }
  }

  const handleSlugManualEdit = () => {
    setManualSlugEdit(true)
  }

  async function onSubmit(values: CreatePostFormValues) {
    // Check if user is authenticated
    if (status !== 'authenticated' || !session) {
      toast.error('You must be signed in to create posts')
      router.push('/auth/signin')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          published: false, // Always create as draft initially
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to create post')
        return
      }

      toast.success('Post created successfully!')
      
      // Redirect to the newly created post
      router.push(`/blog/${result.data.slug}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter post title..."
                  {...field}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                The main title of your blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="post-url-slug"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleSlugManualEdit()
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                URL-friendly version of the title (auto-generated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content..."
                  className="min-h-[200px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                The main content of your blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description..."
                  className="min-h-[80px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                A short summary shown in post previews
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}