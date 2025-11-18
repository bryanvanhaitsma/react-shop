This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Features Demonstrated in This Application

This project is designed to showcase a compact, production-minded Next.js e-commerce demo suitable for a portfolio. The list below highlights the most important architecture, UX, and engineering choices made in the codebase.

- Core stack
  - Next.js (App Router) + TypeScript for modern, file-based routing and strong typing.
  - Tailwind CSS for utility-first, responsive styling with a small centralized global stylesheet for theme tokens and variables.

- Component-driven architecture
  - Reusable, focused React components (product cards, headers, buttons) and small presentational containers.
  - Client and server boundaries are respected ("use client" where hooks/state are required).

- State & patterns
  - Context + custom hooks (Cart, Wishlist) for local app state and composable logic.
  - Services layer that centralizes API calls and keeps components thin.

- UX, forms & accessibility
  - Multi-step checkout flow with a clear progress indicator and keyboard/tab-order improvements.
  - Address autocomplete integration (Geoapify) that populates the shipping form while keeping fields accessible and editable.

- Data & integrations
  - Integrates multiple external product APIs via a consolidated services folder so different sources can be consumed consistently.

- Performance & polish
  - Optimized image handling with `next/image` where appropriate and attention to layout stability (consistent card sizing, anchored footers).
  - Small visual enhancements: gradients, subtle animations, and responsive grid layouts.

- Developer experience
  - TypeScript types for domain models, utility formatters, and small helpers for common tasks (slugify, truncate, price formatting).
  - Minimal, easy-to-run project setup (npm/Yarn/pnpm) for local development and iteration.

- Unit Tests
  - Built unit tests using Vitest to ensure more reliable code 