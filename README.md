# Blog Mini Production App

A modern, production-ready blog application built with **Next.js (App Router)**, **TypeScript**, **Contentful**, **Tailwind CSS**, and **shadcn/ui**.

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript (strict mode, no `any`)
- **CMS**: Contentful Delivery API
- **Styling**: Tailwind CSS v4

## Learning Progress

- Learned how to create a Pull Request
- **UI Components**: shadcn/ui
- **Image Optimization**: next/image
- **Deployment**: Vercel
- **Version Control**: GitHub

## Features

- Server-side rendering with ISR (Incremental Static Regeneration)
- Type-safe Contentful data fetching
- Fully responsive design
- SEO metadata with OpenGraph
- Loading states with Skeleton components
- Error handling and 404 pages
- Dark mode support
- Production-ready performance

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd content-flow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Contentful

**For detailed step-by-step instructions, see [CONTENTFUL_SETUP.md](CONTENTFUL_SETUP.md)**

Quick summary:
1. Create a free account at [contentful.com](https://contentful.com)
2. Create a new space
3. Create a BlogPost content type with these fields:
   - `title` (Short Text, required)
   - `slug` (Short Text, required, unique)
   - `excerpt` (Long Text)
   - `content` (Rich Text)
   - `coverImage` (Media, optional)
   - `publishedDate` (Date & Time)
4. Create at least 3 sample blog posts
5. Get your API credentials (Space ID & Access Token)

### 4. Configure Environment Variables

**For detailed instructions, see [CONTENTFUL_SETUP.md](CONTENTFUL_SETUP.md#configure-environment-variables)**

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Contentful credentials:

```env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

Find these in Contentful:
- **Space ID**: Settings > API keys (displayed at top)
- **Access Token**: Settings > API keys > Content delivery tokens > Generate personal token

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page with latest posts
│   ├── globals.css         # Global styles
│   └── blog/
│       ├── page.tsx        # Blog list page
│       └── [slug]/
│           ├── page.tsx    # Blog detail page
│           └── not-found.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx      # shadcn/ui Button
│   │   ├── card.tsx        # shadcn/ui Card
│   │   ├── badge.tsx       # shadcn/ui Badge
│   │   └── skeleton.tsx    # Skeleton loading component
│   └── navigation.tsx      # Navigation component
└── lib/
    ├── types.ts            # TypeScript types
    ├── contentful.ts       # Contentful API client
    └── utils.ts            # Utility functions
```

## Pages

### Home (/)
- Hero section with CTA button
- Latest 3 blog posts with cover images
- Responsive grid layout

### Blog List (/blog)
- All blog posts in a list format
- Title, excerpt, and published date
- Cover image preview
- Responsive layout with loading states

### Blog Detail (/blog/[slug])
- Full blog post with title, date, and cover image
- Rich text content rendering
- SEO metadata
- Back to blog navigation
- 404 page for non-existent slugs

## Contentful Model

### BlogPost Content Type

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | Short Text | Yes | Article title |
| slug | Short Text | Yes | URL-friendly identifier (unique) |
| excerpt | Long Text | No | Short description |
| content | Rich Text | No | Full article content |
| coverImage | Media | No | Featured image |
| publishedDate | Date & Time | No | Publication date |

## Development

### Adding New Components

New shadcn/ui components can be added to `src/components/ui/`. They use:
- CVA (Class Variance Authority) for variants
- Tailwind CSS for styling
- Type-safe props

### Fetching Data

All Contentful data is fetched through typed functions in `lib/contentful.ts`:

```typescript
import { getPosts, getPostBySlug, getLatestPosts } from "@/lib/contentful";

// Get all posts
const posts = await getPosts();

// Get a single post by slug
const post = await getPostBySlug("my-post-slug");

// Get the latest N posts
const latest = await getLatestPosts(5);
```

### Type Safety

All responses are mapped to clean domain types defined in `lib/types.ts`. No direct Contentful SDK usage in components.

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel: [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel project settings:
   - `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
4. Deploy

### ISR Configuration

The app uses Incremental Static Regeneration (ISR) with a 3600-second (1 hour) revalidation interval. This can be adjusted in `lib/contentful.ts`:

```typescript
next: {
  revalidate: 3600, // Update in seconds
}
```

## Performance Optimizations

- Image optimization with `next/image`
- ISR for fast initial page loads
- Streaming UI with React Suspense
- Minimal client-side JavaScript
- Tailwind CSS purging

## GitHub Repository Structure

This repository follows best practices:

- `main` branch: Production-ready code
- Feature branches: New features/fixes with pull requests
- Clear commit messages
- Comprehensive README (this file)

## Optional Enhancements

### Draft/Preview Mode

To enable Contentful preview mode:

1. Add preview token to `.env.local`:
   ```env
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   ```

2. Update `lib/contentful.ts` to support draft mode

### Rich Text Rendering

Currently using simple HTML rendering. For advanced rich text rendering:

```bash
npm install @contentful/rich-text-react-renderer
```

Then update the `RichTextRenderer` component in `src/app/blog/[slug]/page.tsx`.

### Blog Filtering

Add filters for:
- Search by title
- Filter by publish date
- Category/tag filtering

## Troubleshooting

### "Missing Contentful environment variables"

Make sure `.env.local` exists and contains both required variables:
- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`

### No blog posts showing

1. Verify blog posts exist in Contentful
2. Check content type name is `blogPost` (exact match)
3. Verify published date is set
4. Check API access token has Delivery API permissions

### Images not loading

1. Verify image URLs in Contentful start with `https://`
2. Check image field is properly configured
3. Use Contentful's image CDN URL format

## Requirements Checklist

- Home page with hero and latest 3 posts
- Blog list page with all posts
- Blog detail page with dynamic slug routing
- 404 page for non-existent posts
- Contentful integration with Delivery API
- TypeScript (strict, no `any`)
- Tailwind CSS layout
- shadcn/ui components (Button, Card, Badge)
- next/image for images
- ISR for performance
- Error handling
- Env variables via .env.local
- GitHub repository
- Clean code structure
- Production readiness

## License

MIT

## Support & Documentation

For detailed setup guides:
- **[CONTENTFUL_SETUP.md](CONTENTFUL_SETUP.md)** - Complete Contentful implementation guide with screenshots and troubleshooting
- **[AGENTS.md](AGENTS.md)** - Architecture patterns, implementation details, and best practices
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step Vercel deployment guide

For questions or issues, check:
1. [CONTENTFUL_SETUP.md Troubleshooting Section](CONTENTFUL_SETUP.md#troubleshooting)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [Contentful Documentation](https://www.contentful.com/developers/docs/)
4. [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.