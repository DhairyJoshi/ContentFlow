import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts, getPostBySlug } from "@/lib/contentful";
import { formatDate } from "@/lib/utils";
import { richTextToHtml } from "@/lib/richtext";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Content Flow`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage.url }] : [],
    },
  };
}

function RichTextRenderer({ content }: { content: string | any }) {
  const html = richTextToHtml(content);
  
  return (
    <div
      className="prose dark:prose-invert prose-sm sm:prose-base max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function BlogDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

async function BlogDetailContent({
  slug,
}: {
  slug: string;
}) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-3xl mx-auto py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 border-b pb-8 mb-8">
        <Link href="/blogs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
          ← Back to Blog
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted mb-8">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.title || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichTextRenderer content={post.content} />
      </div>
    </article>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<BlogDetailLoading />}>
      <BlogDetailContent slug={slug} />
    </Suspense>
  );
}