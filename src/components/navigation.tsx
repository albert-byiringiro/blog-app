// src/components/navigation.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, Settings, LayoutDashboard, FileText } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { data: session, status } = useSession()
  
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
    })
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl hover:opacity-80 transition-opacity">
            MeeknessNotes
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/blog">Blog</Link>
            </Button>

            {/* Only show these if authenticated */}
            {isAuthenticated && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>

                {/* Only authors and admins see Create Post */}
                {(session?.user?.role === 'AUTHOR' || session?.user?.role === 'ADMIN') && (
                  <Button asChild>
                    <Link href="/blog/create">Create Post</Link>
                  </Button>
                )}
                
                {/* User menu dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Role: {session?.user?.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {(session?.user?.role === 'AUTHOR' || session?.user?.role === 'ADMIN') && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/posts" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          My Posts
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Show Sign In button if not authenticated */}
            {!isAuthenticated && !isLoading && (
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            )}

            {isLoading && (
              <Button variant="ghost" disabled>
                Loading...
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/blog" onClick={() => setIsOpen(false)}>
                Blog
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                {(session?.user?.role === 'AUTHOR' || session?.user?.role === 'ADMIN') && (
                  <Button className="w-full" asChild>
                    <Link href="/blog/create" onClick={() => setIsOpen(false)}>
                      Create Post
                    </Link>
                  </Button>
                )}
                <div className="pt-2 border-t">
                  <p className="px-3 py-2 text-sm font-medium">{session?.user?.name}</p>
                  <p className="px-3 pb-2 text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                >
                  Sign out
                </Button>
              </>
            )}

            {!isAuthenticated && !isLoading && (
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}