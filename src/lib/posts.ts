export async function getPosts() {
  try {
    const response = await fetch('http://localhost:3000/api/posts?published=true', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const response = await fetch('http://localhost:3000/api/posts', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    const posts = result.data || []

    return posts.find((p: any) => p.slug === slug) || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getSearchedPosts(query?: string) {
  try {
    const url = new URL('http://localhost:3000/api/posts')
    url.searchParams.set('published', 'true')

    if (query) {
      // In a real app, your API would filter by query
      // For now, we'll filter client-side
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const result = await response.json()
    let posts = result.data || []

    if (query) {
      const searchLower = query.toLowerCase()
      posts = posts.filter((post: any) => post.title.toLowerCase().includes(searchLower) || post.content.toLowerCase().includes(searchLower))
    }

    return posts
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}