import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Settings, 
  TrendingUp,
  PenTool,
  Shield
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth-utils'

export default async function DashboardPage() {

  const user = await getCurrentUser()

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's an overview of your account and quick actions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.role}</div>
              <p className="text-xs text-muted-foreground">
                Your access level
              </p>
            </CardContent>
          </Card>

          {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Total posts created
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Total post views
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal details and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account Role
                </p>
                <Badge variant={
                  user.role === 'ADMIN' ? 'default' :
                  user.role === 'AUTHOR' ? 'secondary' :
                  'outline'
                }>
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks based on your role and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Actions for all authenticated users */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
                <Link href="/blog">
                  <FileText className="h-5 w-5 mb-2" />
                  <span className="font-semibold">View All Posts</span>
                  <span className="text-xs text-muted-foreground">Browse published content</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
                <Link href="/settings">
                  <Settings className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Account Settings</span>
                  <span className="text-xs text-muted-foreground">Manage your profile</span>
                </Link>
              </Button>

              {/* Actions for AUTHORS and ADMINS */}
              {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
                <>
                  <Button asChild className="h-auto flex-col items-start p-4">
                    <Link href="/blog/create">
                      <PenTool className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Create New Post</span>
                      <span className="text-xs text-muted-foreground">Write a new article</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
                    <Link href="/dashboard/posts">
                      <FileText className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Manage My Posts</span>
                      <span className="text-xs text-muted-foreground">Edit your content</span>
                    </Link>
                  </Button>
                </>
              )}

              {/* Actions for ADMINS only */}
              {user.role === 'ADMIN' && (
                <>
                  <Button asChild variant="secondary" className="h-auto flex-col items-start p-4">
                    <Link href="/admin/users">
                      <Users className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Manage Users</span>
                      <span className="text-xs text-muted-foreground">User administration</span>
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="h-auto flex-col items-start p-4">
                    <Link href="/admin/posts">
                      <Shield className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Manage All Posts</span>
                      <span className="text-xs text-muted-foreground">Moderate content</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>
              What you can do with your {user.role} role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {user.role === 'ADMIN' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Full System Access</p>
                      <p className="text-sm text-muted-foreground">Complete control over all features</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">User Management</p>
                      <p className="text-sm text-muted-foreground">Create, edit, and delete user accounts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Content Moderation</p>
                      <p className="text-sm text-muted-foreground">Manage all posts from any user</p>
                    </div>
                  </li>
                </>
              )}
              {user.role === 'AUTHOR' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Create Content</p>
                      <p className="text-sm text-muted-foreground">Write and publish blog posts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Manage Own Posts</p>
                      <p className="text-sm text-muted-foreground">Edit and delete your own content</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-muted-foreground mt-0.5">✗</span>
                    <div>
                      <p className="font-medium text-muted-foreground">Limited Access</p>
                      <p className="text-sm text-muted-foreground">Cannot manage other users' posts</p>
                    </div>
                  </li>
                </>
              )}
              {user.role === 'READER' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Read Content</p>
                      <p className="text-sm text-muted-foreground">Access all published posts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <p className="font-medium">Comment & Interact</p>
                      <p className="text-sm text-muted-foreground">Engage with content (coming soon)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-muted-foreground mt-0.5">✗</span>
                    <div>
                      <p className="font-medium text-muted-foreground">No Publishing Rights</p>
                      <p className="text-sm text-muted-foreground">Cannot create or edit posts</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}