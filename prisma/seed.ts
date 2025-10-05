import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n')

    console.log('👤 Creating users...')

    // Create first user
    const user1 = await prisma.user.create({
        data: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        },
    })
    console.log(`✅ Created user: ${user1.name} (${user1.email})`)

    // Create second user
    const user2 = await prisma.user.create({
        data: {
        email: 'bob@example.com',
        name: 'Bob Smith',
        },
    })
    console.log(`✅ Created user: ${user2.name} (${user2.email})`)

    console.log('')

    // CREATE POSTS

    console.log('📝 Creating blog posts...')

    // Alice's first post (published)
    const post1 = await prisma.post.create({
        data: {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        content: `
            Next.js is an amazing framework for building React applications. 
            In this post, we'll explore the basics of Next.js and why it's 
            become so popular among developers.
            
            ## Why Next.js?
            - Server-side rendering
            - File-based routing
            - API routes
            - Great developer experience
            
            Let's dive in!
        `.trim(),
        excerpt: 'Learn the basics of Next.js and why it\'s so popular.',
        published: true,
        authorId: user1.id,  // Connect to Alice
        },
    })
    console.log(`✅ Created post: "${post1.title}" by ${user1.name}`)

    // Alice's second post (draft)
    const post2 = await prisma.post.create({
        data: {
        title: 'Understanding Prisma ORM',
        slug: 'understanding-prisma-orm',
        content: `
            Prisma is a next-generation ORM that makes database access easy 
            and type-safe. In this draft, I'm exploring how to use Prisma 
            with MongoDB.
        `.trim(),
        excerpt: 'A deep dive into Prisma ORM and MongoDB integration.',
        published: false,  // This is a draft
        authorId: user1.id,
        },
    })
    console.log(`✅ Created post: "${post2.title}" (draft) by ${user1.name}`)

    // Bob's post (published)
    const post3 = await prisma.post.create({
        data: {
        title: 'Building a Blog with TypeScript',
        slug: 'building-blog-typescript',
        content: `
            TypeScript adds type safety to JavaScript, making your code more 
            robust and maintainable. Here's how we use it in our blog application.
            
            ## Benefits of TypeScript
            1. Catch errors at compile time
            2. Better IDE support
            3. Self-documenting code
            4. Easier refactoring
        `.trim(),
        excerpt: 'Learn how TypeScript improves your development workflow.',
        published: true,
        authorId: user2.id,  // Connect to Bob
        },
    })
    console.log(`✅ Created post: "${post3.title}" by ${user2.name}`)

    console.log('')
}

// Execute seed function
main()
    .catch((error) => {
        console.error('Error during seeding:')
        console.error(error)
        process.exit(1)    
    })
    .finally(async () => {
        await prisma.$disconnect()
    })