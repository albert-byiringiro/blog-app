// prisma/seed.ts

import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ============================================
  // CREATE USERS WITH DIFFERENT ROLES
  // ============================================
  
  console.log('👤 Creating users...')

  // Create an ADMIN user
  // Admins can manage everything in the system
  const adminPassword = await bcrypt.hash('admin123', 10) // Hash password with bcrypt
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN, // Full system access
      emailVerified: new Date(), // Email pre-verified for testing
    },
  })
  console.log(`✅ Created ADMIN: ${admin.name} (${admin.email})`)

  // Create an AUTHOR user
  // Authors can create and manage their own posts
  const authorPassword = await bcrypt.hash('author123', 10)
  const author = await prisma.user.create({
    data: {
      email: 'author@example.com',
      name: 'Alice Johnson',
      password: authorPassword,
      role: Role.AUTHOR, // Can create posts
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Created AUTHOR: ${author.name} (${author.email})`)

  // Create a READER user
  // Readers can only view published content
  const readerPassword = await bcrypt.hash('reader123', 10)
  const reader = await prisma.user.create({
    data: {
      email: 'reader@example.com',
      name: 'Bob Smith',
      password: readerPassword,
      role: Role.READER, // Read-only access
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Created READER: ${reader.name} (${reader.email})`)

  console.log('')

  // ============================================
  // CREATE BLOG POSTS
  // ============================================
  
  console.log('📝 Creating blog posts...')

  // Admin's post
  const post1 = await prisma.post.create({
    data: {
      title: 'Welcome to Our Blog Platform',
      slug: 'welcome-to-our-blog',
      content: `
        Welcome to our new blog platform! This post was created by an admin.
        
        ## About This Platform
        This is a full-featured blog built with Next.js, Prisma, and MongoDB.
        We now have authentication with three user roles:
        - Admins (full control)
        - Authors (can write posts)
        - Readers (can read posts)
        
        Stay tuned for more content!
      `.trim(),
      excerpt: 'Welcome post from the admin introducing the platform.',
      published: true,
      authorId: admin.id, // Connected to admin user
    },
  })
  console.log(`✅ Created post: "${post1.title}" by ${admin.name}`)

  // Author's published post
  const post2 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `
        Next.js is an amazing framework for building React applications.
        
        ## Why Next.js?
        - Server-side rendering
        - File-based routing
        - API routes
        - Great developer experience
        
        Let's dive in!
      `.trim(),
      excerpt: 'Learn the basics of Next.js and why it\'s so popular.',
      published: true,
      authorId: author.id, // Connected to author user
    },
  })
  console.log(`✅ Created post: "${post2.title}" by ${author.name}`)

  // Author's draft post
  const post3 = await prisma.post.create({
    data: {
      title: 'Understanding Authentication in Next.js',
      slug: 'nextjs-authentication-guide',
      content: `
        In this post, we'll explore how to implement secure authentication
        in Next.js applications using NextAuth.js.
        
        This is still a work in progress...
      `.trim(),
      excerpt: 'A comprehensive guide to NextAuth.js implementation.',
      published: false, // Draft post
      authorId: author.id,
    },
  })
  console.log(`✅ Created post: "${post3.title}" (draft) by ${author.name}`)

  console.log('')
  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Test Accounts:')
  console.log('Admin:  admin@example.com  / admin123')
  console.log('Author: author@example.com / author123')
  console.log('Reader: reader@example.com / reader123')
}

// Execute seed function
main()
  .catch((error) => {
    console.error('❌ Error during seeding:')
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })