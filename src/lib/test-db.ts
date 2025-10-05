import { prisma } from './prisma'

async function testDatabase() {
  console.log('🧪 Testing database connection...\n')

  try {
    // ============================================
    // TEST 1: Fetch All Users
    // ============================================
    console.log('📋 Test 1: Fetching all users...')
    const users = await prisma.user.findMany()
    console.log(`✅ Found ${users.length} users:`)
    users.forEach((user: typeof users[number]) => {
      console.log(`   - ${user.name} (${user.email})`)
    })
    console.log('')

    // ============================================
    // TEST 2: Fetch All Posts with Authors
    // ============================================
    console.log('📋 Test 2: Fetching all posts with authors...')
    const posts = await prisma.post.findMany({
      include: {
        author: true,  // Include related author data
      },
      orderBy: {
        createdAt: 'desc',  // Newest first
      },
    })
    console.log(`✅ Found ${posts.length} posts:`)
    posts.forEach((post: typeof posts[number]) => {
      const status = post.published ? '✓ Published' : '✗ Draft'
      console.log(`   ${status}: "${post.title}" by ${post.author?.name || 'Unknown'}`)
    })
    console.log('')

    // ============================================
    // TEST 3: Fetch User with Their Posts
    // ============================================
    console.log('📋 Test 3: Fetching Alice and her posts...')
    const alice = await prisma.user.findUnique({
      where: {
        email: 'alice@example.com',
      },
      include: {
        posts: true,  // Include all posts by this user
      },
    })
    
    if (alice) {
      console.log(`✅ Found user: ${alice.name}`)
      console.log(`   Posts written: ${alice.posts.length}`)
      alice.posts.forEach((post: typeof posts[number]) => {
        console.log(`   - "${post.title}" (${post.published ? 'published' : 'draft'})`)
      })
    } else {
      console.log('❌ Alice not found')
    }
    console.log('')

    // ============================================
    // TEST 4: Fetch Only Published Posts
    // ============================================
    console.log('📋 Test 4: Fetching only published posts...')
    const publishedPosts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
    })
    console.log(`✅ Found ${publishedPosts.length} published posts:`)
    publishedPosts.forEach((post: typeof posts[number]) => {
      console.log(`   - "${post.title}" by ${post.author?.name}`)
    })
    console.log('')

    console.log('✅ All database tests passed! 🎉')
    console.log('Your Prisma setup is working correctly.\n')
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    // Always disconnect
    await prisma.$disconnect()
  }
}

// Run the test
testDatabase()