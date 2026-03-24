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
    title: `${post.title} | Blog`,
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
    <article className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/blog">
          <Button variant="outline">← Back to Blog</Button>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
          <Badge variant="secondary">{formatDate(post.publishedDate)}</Badge>
          <span>•</span>
          <span>By Blog</span>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.title || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Excerpt */}
      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        {post.content ? (
          <RichTextRenderer content={post.content} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Full content coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <Link href="/blog">
          <Button variant="outline">← Back to Blog</Button>
        </Link>
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