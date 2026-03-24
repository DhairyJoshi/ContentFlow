import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/lib/contentful";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog | All Articles",
  description: "Browse all blog articles and stories",
};

async function BlogPostsList() {
  try {
    const posts = await getPosts();

    if (posts.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No blog posts yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex gap-4 p-6 h-full">
                {post.coverImage && (
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage.url}
                      alt={post.coverImage.title || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <CardTitle className="mb-2">{post.title}</CardTitle>
                    <CardDescription className="mb-2">
                      {formatDate(post.publishedDate)}
                    </CardDescription>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Read</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 dark:text-red-400">
          Failed to load blog posts. Please try again later.
        </p>
      </div>
    );
  }
}

function BlogPostsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex gap-4">
            <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          All Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse and read all our latest articles and stories
        </p>
      </div>

      <Suspense fallback={<BlogPostsLoading />}>
        <BlogPostsList />
      </Suspense>
    </div>
  );
}
