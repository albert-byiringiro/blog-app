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
