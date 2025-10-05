
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="font-bold text-xl">
          Blog App
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button asChild>
            <Link href="/blog/create">Create Post</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}