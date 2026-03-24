import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
          <p className="text-muted-foreground text-lg">No blog posts yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                {post.coverImage && (
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={post.coverImage.url}
                      alt={post.coverImage.title || post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(post.publishedDate)}</span>
                    </CardDescription>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary" className="px-3 py-1">Article</Badge>
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
        <p className="text-destructive text-lg">
          Unable to load posts. Please try again later.
        </p>
      </div>
    );
  }
}

function BlogPostsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Skeleton className="w-full sm:w-48 aspect-video sm:aspect-square rounded-md shrink-0" />
            <div className="flex-1 space-y-4 py-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
          All Articles
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse our latest thoughts, ideas, and tutorials.
        </p>
      </div>

      <Suspense fallback={<BlogPostsLoading />}>
        <BlogPostsList />
      </Suspense>
    </div>
  );
}