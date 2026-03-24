# ContentFlow - Modern Blog Application

A production-ready blog platform built with Next.js 16.2.1, TypeScript, Contentful CMS, Tailwind CSS, and React 19. Includes rich text rendering, full-text search, responsive design, and optimized performance.

## Technology Stack

- **Framework**: Next.js 16.2.1 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **CMS**: Contentful (Delivery & Preview APIs)
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui components
- **Rich Text**: @contentful/rich-text-react-renderer with custom renderers
- **Search**: Debounced client-side search with URL persistence
- **Performance**: ISR, Image Optimization, Streaming with Suspense
- **Deployment**: Vercel

## Features

- Contentful CMS integration with type-safe, fully typed data fetching
- Rich text content rendering with 15+ node types (headings, lists, quotes, code, links, embedded assets)
- Full-text search with debounced filtering and URL state persistence
- Draft mode support via Contentful Preview API
- Incremental Static Regeneration (1-hour revalidation)
- Server Components for data fetching with Client Components for interactivity
- Streaming UI with React Suspense and skeleton loading states
- Image optimization with responsive sizing from Contentful CDN
- SEO metadata with OpenGraph support
- Error handling and custom 404 pages
- Dark mode support
- Responsive mobile-first design
- Debug logging for development and troubleshooting
- Production-ready error boundaries

## Getting Started

### Prerequisites

- Node.js 23.6+ and npm 11+
- Contentful account (free at [contentful.com](https://contentful.com))

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd contentflow
npm install
```

2. Set up Contentful space with BlogPost content type:
   - Create new space in Contentful dashboard
   - Create BlogPost content type with fields:
     - `title` (Short Text, required)
     - `slug` (Short Text, required, unique)
     - `excerpt` (Long Text)
     - `content` (Rich Text)
     - `coverImage` (Media)
     - `publishedDate` (Date & Time)
   - Create 3+ sample blog posts and publish

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Add Contentful credentials to `.env.local`:
```env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
```

4. Run development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page with latest posts
│   ├── globals.css             # Global styles with Tailwind
│   ├── api/
│   │   ├── draft/              # Draft mode endpoint
│   │   └── disable-draft/      # Disable draft mode endpoint
│   └── blogs/
│       ├── page.tsx            # Blog list with search filtering
│       └── [slug]/
│           ├── page.tsx        # Blog detail with rich text
│           └── not-found.tsx   # 404 page
├── components/
│   ├── navigation.tsx          # Site navigation
│   ├── rich-text.tsx           # Rich text renderer (client)
│   ├── blog-filter.tsx         # Search component (client)
│   ├── preview-banner.tsx      # Draft mode indicator
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       └── input.tsx
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── contentful.ts           # Contentful API client
    ├── richtext.ts             # Rich text utilities
    └── utils.ts                # Helper functions
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section and latest 3 posts |
| `/blogs` | Blog list with full-text search filtering |
| `/blogs/[slug]` | Individual blog post with rich text content and metadata |
| `/blogs/[slug]/not-found` | 404 page for non-existent posts |

## Key Components

### RichText Component
Renders Contentful rich text with support for:
- Headings (H1-H6) with semantic styling
- Paragraphs with proper typography
- Ordered and unordered lists
- Blockquotes and code blocks
- Hyperlinks and internal links
- Embedded images and assets
- Text formatting (bold, italic, underline, code)
- Keyboard shortcuts for code

### BlogFilter Component
Full-width search with:
- Search icon with focus state transitions
- 300ms debounced text input
- URL-persisted search state
- Clear button (hidden when not searching)
- Loading indicator during search
- Minimalist modern design

### UI Components
- Button: Size and variant options
- Card: Composite card structure for blog posts
- Badge: Tag styling for content categories
- Input: Accessible text input with focus states
- Skeleton: Placeholder loading states

## Contentful Model

### BlogPost Content Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | Short Text | Yes | Article headline |
| slug | Short Text | Yes | URL-friendly identifier (must be unique) |
| excerpt | Long Text | No | Short description for preview cards |
| content | Rich Text | No | Full article content with formatting |
| coverImage | Media | No | Featured image for blog card and detail |
| publishedDate | Date & Time | No | Publication timestamp for sorting |

### API Queries

All data fetching is type-safe and centralized in `lib/contentful.ts`:

```typescript
import { getPosts, getPostBySlug, getLatestPosts } from "@/lib/contentful";

// Get all posts with optional search
const posts = await getPosts({ query?: string });

// Get single post by slug
const post = await getPostBySlug(slug);

// Get latest N posts
const latest = await getLatestPosts(3);
```

Data is automatically mapped from Contentful raw responses to clean domain types.

## Development

### Build and Development Commands

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run start      # Run production build locally
npm run lint       # Check code quality
npx tsc --noEmit   # Type check without emitting
```

### Code Organization

- **Server Components**: Data fetching in app/ pages
- **Client Components**: Marked with 'use client' for interactivity
- **Utilities**: Shared functions in lib/ directory
- **UI Components**: Reusable shadcn/ui components in components/ui
- **Types**: Centralized TypeScript interfaces in lib/types.ts

### Adding Features

- New pages: Create `.tsx` file in `src/app/`
- New components: Add to `src/components/`
- New API functions: Extend `src/lib/contentful.ts`
- New types: Update `src/lib/types.ts`

## Deployment

### Vercel

1. Push code to GitHub
2. Connect repository in Vercel dashboard: [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel project settings:
   - `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_PREVIEW_ACCESS_TOKEN`
4. Deploy

Incremental Static Regeneration is configured for 3600-second (1 hour) revalidation intervals.

## Performance

- Next.js 16.2.1 with React Compiler (Babel plugin tree shaking)
- Image optimization with responsive sizing
- Incremental Static Regeneration for cache invalidation
- React 19 Suspense for streaming UI
- Minimal client-side JavaScript
- Tailwind CSS purging of unused styles

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` | Yes | Contentful space identifier (public) |
| `CONTENTFUL_ACCESS_TOKEN` | Yes | Delivery API token (server-side only) |
| `CONTENTFUL_PREVIEW_ACCESS_TOKEN` | No | Preview API token for draft mode |

## Troubleshooting

### No blog posts appearing
- Check environment variables are set in `.env.local`
- Verify Contentful space ID and access token are correct
- Confirm BlogPost content type exists and matches exactly
- Ensure blog posts have publishDate set and are published
- Check API token has Delivery API access permissions

### Images not loading
- Verify Contentful media URLs use HTTPS
- Check cover images are assigned in Contentful editor
- Ensure image field is configured in BlogPost content type
- Test Contentful CDN is accessible

### Search not working
- Open browser console to check for JavaScript errors
- Verify search terms match post titles or excerpts
- Check blog post data is loading in network tab
- Clear browser cache and reload page

### Build errors on Windows
- Current version uses webpack on Windows (Next.js 16.2.1 limitation)
- Build may be slower than webpack baseline
- Turbopack will be enabled when Next.js upgrade fixes Windows support

### Build fails with "Next.js package not found"
- This was a Turbopack issue on Windows - now fixed with webpack fallback
- If still occurring, try clearing cache: `rm -rf .next node_modules/.cache`
- Reinstall dependencies: `npm install`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful API Docs](https://www.contentful.com/developers/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)