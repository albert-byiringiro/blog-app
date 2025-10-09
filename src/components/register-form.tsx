'use client'

import { registerFormSchema, RegisterFormValues } from "@/validations/authSchema"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'

export function RegisterForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'READER',
        },
    })

    async function onSubmit(values: RegisterFormValues) {
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                })
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || 'Registration failed')
                return
            }

            toast.success('Account created successfully!')

            toast.info('Please check your email to verify your account')

            setTimeout(() => {
                router.push('/auth/signin')
            }, 2000)
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                This will be displayed on your posts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Must be at least 6 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Selection */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="READER">
                    Reader - Browse and read posts
                  </SelectItem>
                  <SelectItem value="AUTHOR">
                    Author - Create and publish posts
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can change this later in your profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  )
}