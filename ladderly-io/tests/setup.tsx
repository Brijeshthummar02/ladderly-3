import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'
import React from 'react'
import { PaymentTierEnum } from '@prisma/client'

// Extend Vitest's expect method with React Testing Library's matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock server-side modules
vi.mock('~/server/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({})),
  },
}))

vi.mock('~/server/env', () => ({
  env: {
    NODE_ENV: 'test',
    DISCORD_CLIENT_ID: 'test-discord-id',
    DISCORD_CLIENT_SECRET: 'test-discord-secret',
    GITHUB_CLIENT_ID: 'test-github-id',
    GITHUB_CLIENT_SECRET: 'test-github-secret',
    GOOGLE_CLIENT_ID: 'test-google-id',
    GOOGLE_CLIENT_SECRET: 'test-google-secret',
    EMAIL_SERVER: 'test-email-server',
    EMAIL_FROM: 'test@example.com',
    NEXTAUTH_SECRET: 'test-nextauth-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
}))

// Mock server-only
vi.mock('server-only', () => ({}))

// Mock auth
vi.mock('~/server/auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: null })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getServerSession: vi.fn(() => Promise.resolve(null)),
  LadderlyMigrationAdapter: vi.fn(),
  createLadderlySession: vi.fn(),
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    toString: () => '',
  }),
  usePathname: () => '',
  notFound: vi.fn(),
}))

// Set up global fetch mock
global.fetch = vi.fn()

// Simple CSS mock
vi.mock('**/*.css', () => ({
  default: new Proxy(
    {},
    {
      get: (target, prop) => prop,
    },
  ),
}))

// Mock common components that might access server-side resources
vi.mock('~/app/core/components/page-wrapper/LadderlyPageWrapper', () => ({
  LadderlyPageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

// Mock headers for API routes
vi.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: () => null,
    getAll: () => [],
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

// Update the trpc mock in setup.tsx
vi.mock('~/server/api/trpc', () => {
  return {
    createTRPCRouter: (routes: any) => routes,
    publicProcedure: {
      query: (fn: any) => fn,
      mutation: (fn: any) => fn,
      input: (schema: any) => ({
        query: (fn: any) => fn,
        mutation: (fn: any) => fn,
      }),
    },
    protectedProcedure: {
      query: (fn: any) => fn,
      mutation: (fn: any) => fn,
      input: (schema: any) => ({
        query: (fn: any) => fn,
        mutation: (fn: any) => fn,
      }),
    },
    createCallerFactory: (router: any) => {
      return (ctx: any) => {
        return Object.fromEntries(
          Object.entries(router).map(([key, value]) => {
            if (typeof value === 'object') {
              return [key, createCallerFactory(value)(ctx)]
            }
            return [key, (...args) => value({ ctx, ...args })]
          }),
        )
      }
    },
    createTRPCContext: ({ headers = new Headers(), ...rest } = {}) => ({
      headers,
      ...rest,
    }),
  }
})
