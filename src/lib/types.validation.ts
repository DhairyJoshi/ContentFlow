"use client";

import { BlogPost, ContentfulResponse } from "@/lib/types";
import { getPosts, getPostBySlug } from "@/lib/contentful";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

async function validExample(): Promise<void> {
  const allPosts: BlogPost[] = await getPosts();

  allPosts.forEach((post) => {
    console.log(post.title);
    console.log(post.slug);
    console.log(post.publishedDate);
  });

  const singlePost = await getPostBySlug("some-slug");

  if (singlePost) {
    console.log(singlePost.title);
  }
}

function ComponentExample(): JSX.Element {
  return (
    <>
      {/* Button with valid props */}
      <Button variant="default" size="lg">
        Click me
      </Button>

      {/* Card with valid props */}
      <Card className="p-6">Content</Card>
    </>
  );
}

interface TypedContentfulResponse {
  items: { sys: { id: string } }[];
  total: number;
  skip: number;
  limit: number;
}

const commonComparison: TypedContentfulResponse = {
  items: [],
  total: 0,
  skip: 0,
  limit: 100,
};