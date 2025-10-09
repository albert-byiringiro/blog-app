import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Sparkles, Zap } from "lucide-react"
import { getPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  // Fetch latest 3 posts for homepage
  const { posts } = await getPosts('', 1)
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Welcome to MeeknessNotes
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Thoughts, ideas, and{' '}
            <span className="text-primary">insights</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A collection of writings on technology, design, and the craft of building meaningful software.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg h-12">
              <Link href="/blog">
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg h-12">
              <Link href="#latest">
                Latest Posts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Deep Dives</CardTitle>
                <CardDescription>
                  Comprehensive explorations of complex topics, broken down into digestible insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Practical</CardTitle>
                <CardDescription>
                  Real-world examples and actionable takeaways you can apply immediately.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Thought-Provoking</CardTitle>
                <CardDescription>
                  Fresh perspectives and ideas that challenge conventional thinking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Latest Articles
              </h2>
              <p className="text-muted-foreground mt-2">
                Recent thoughts and explorations
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {latestPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No posts yet. Check back soon for new content!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">
                        {formatDate(post.createdAt)}
                      </Badge>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center text-sm text-primary group-hover:underline">
                        Read article
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  New articles and insights delivered regularly. Subscribe to get notified when new content is published.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg">
                    <Link href="/blog">
                      Browse All Posts
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}