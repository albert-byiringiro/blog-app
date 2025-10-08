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

export async function getPosts(query?: string, page: number = 1) {
  try {
    const url = new URL('http://localhost:3000/api/posts')
    url.searchParams.set('published', 'true')
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '9')
    
    if (query) {
      url.searchParams.set('search', query)
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const result = await response.json()

    return {
      posts: result.data || [],
      pagination: result.pagination || { 
        page: 1, 
        totalPages: 0, 
        hasMore: false,
        totalCount: 0,
        limit: 9
      },
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      pagination: { 
        page: 1, 
        totalPages: 0, 
        hasMore: false,
        totalCount: 0,
        limit: 9
      },
    }
  }
}