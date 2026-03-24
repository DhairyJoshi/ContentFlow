import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestPosts } from "@/lib/contentful";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home | Blog",
  description: "Welcome to our blog. Discover the latest articles.",
};

async function LatestPostsList() {
  try {
    const posts = await getLatestPosts(3);

    if (posts.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No blog posts yet.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            {post.coverImage && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.title || post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription>{formatDate(post.publishedDate)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>
            </CardContent>
            <div className="px-6 pb-6">
              <Link href={`/blog/${post.slug}`} className="w-full">
                <Button className="w-full" size="sm">
                  Read More
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No blog posts available at the moment.
        </p>
      </div>
    );
  }
}

function LatestPostsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="w-full h-48" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover insightful articles about web development, technology, and modern software practices.
        </p>
        <Link href="/blog">
          <Button size="lg">
            Explore All Articles
          </Button>
        </Link>
      </section>

      {/* Latest Posts Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Latest Articles
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Stay updated with our most recent posts
          </p>
        </div>
        <Suspense fallback={<LatestPostsLoading />}>
          <LatestPostsList />
        </Suspense>
      </section>
    </div>
  );
}