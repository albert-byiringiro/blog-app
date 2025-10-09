// src/lib/auth-utils.ts

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'

/**
 * Get current user session (Server Components)
 * 
 * Throws error and redirects if not authenticated
 * Use this when authentication is required
 * 
 * @returns User object from session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/auth/signin')
  }

  return session.user
}

/**
 * Get session if exists (optional authentication)
 * 
 * Returns null if not authenticated
 * Use this when authentication is optional
 * 
 * @returns User object or null
 */
export async function getOptionalUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}

/**
 * Check if user has required role
 * 
 * @param requiredRole - Minimum role required
 * @returns true if user has required role or higher
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return false
  }

  const user = session.user

  // Role hierarchy: ADMIN > AUTHOR > READER
  const roleHierarchy: Record<Role, number> = {
    ADMIN: 3,
    AUTHOR: 2,
    READER: 1,
  }

  const userRoleLevel = roleHierarchy[user.role as Role]
  const requiredRoleLevel = roleHierarchy[requiredRole]

  return userRoleLevel >= requiredRoleLevel
}

/**
 * Require specific role (Server Components)
 * 
 * Redirects to unauthorized page if user doesn't have required role
 * 
 * @param requiredRole - Role required to access the resource
 */
export async function requireRole(requiredRole: Role) {
  const hasRequiredRole = await hasRole(requiredRole)

  if (!hasRequiredRole) {
    redirect('/unauthorized')
  }
}

/**
 * Check if user is admin
 * 
 * @returns true if user has ADMIN role
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

/**
 * Check if user can create posts
 * 
 * @returns true if user is AUTHOR or ADMIN
 */
export async function canCreatePosts(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  return role === 'AUTHOR' || role === 'ADMIN'
}

/**
 * Check if user can edit a specific post
 * 
 * Admins can edit any post
 * Authors can only edit their own posts
 * 
 * @param postAuthorId - ID of the post's author
 * @returns true if user can edit the post
 */
export async function canEditPost(postAuthorId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) return false

  // Admins can edit any post
  if (session.user.role === 'ADMIN') return true

  // Authors can edit their own posts
  if (session.user.role === 'AUTHOR' && session.user.id === postAuthorId) {
    return true
  }

  return false
}

/**
 * Require authentication for API routes
 * 
 * @returns User object if authenticated
 * @throws Error if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}

export function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'AUTHOR':
      return '/dashboard/posts'  // Authors go to their posts
    case 'ADMIN':
      return '/dashboard'        // Admins go to main dashboard
    case 'READER':
      return '/blog'             // Readers go to blog
    default:
      return '/dashboard'        // Fallback
  }
}