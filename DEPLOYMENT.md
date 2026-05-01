# LeanDoze Deployment

LeanDoze is ready for Vercel with Neon Postgres, Prisma, and Clerk.

## Environment Variables

Set these in Vercel Project Settings:

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Database

1. Create a Neon Postgres database.
2. Copy the pooled connection string to `DATABASE_URL`.
3. Run migrations:

```bash
npm run prisma:migrate
```

## Safety Language

LeanDoze tracks patient-entered data, detects patterns, creates flags, and generates reports. It must not diagnose, prescribe, or recommend dose changes. Safety flags should use: “Review this with your clinician.”

## Current Limitation

This local checkout has no GitHub remote configured. Add one before pushing:

```bash
git remote add origin <github-repo-url>
```
