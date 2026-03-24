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
  title: "Home | Content Flow",
  description: "Welcome to Content Flow. Discover the latest articles.",
};

async function LatestPostsList() {
  try {
    const posts = await getLatestPosts(3);

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts yet.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
            {post.coverImage && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.title || post.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-2 text-lg leading-tight">{post.title}</CardTitle>
              <CardDescription className="text-xs">{formatDate(post.publishedDate)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <div className="p-4 pt-0">
              <Link href={`/blogs/${post.slug}`} className="w-full">
                <Button className="w-full" variant="secondary" size="sm">
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
      <div className="text-center py-12">
        <p className="text-destructive">
          Unable to load posts. Please try again later.
        </p>
      </div>
    );
  }
}

function LatestPostsLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <Skeleton className="h-9 w-full mt-4" />
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
      <section className="text-center space-y-6 py-12 md:py-24">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
            Welcome to Content Flow
          </h1>
          <p className="text-xl text-muted-foreground max-w-150 mx-auto">
            Discover insightful content about web development, technology, and modern software practices.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/blogs">
            <Button size="lg">Browse Articles</Button>
          </Link>
          <Link href="https://github.com" target="_blank">
            <Button variant="outline" size="lg">GitHub</Button>
          </Link>
        </div>
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