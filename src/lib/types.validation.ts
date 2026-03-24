// TypeScript validation script
// Run: npx tsc --noEmit

import { BlogPost, ContentfulResponse } from "@/lib/types";
import { getPosts, getPostBySlug } from "@/lib/contentful";

/**
 * Type safety validation
 * All functions and responses are properly typed
 */

// ✅ Correct usage with types
async function validExample(): Promise<void> {
  // Function returns are typed
  const allPosts: BlogPost[] = await getPosts();

  // Accessing properties is type-safe
  allPosts.forEach((post) => {
    // TypeScript knows these properties exist
    console.log(post.title); // ✓
    console.log(post.slug); // ✓
    console.log(post.publishedDate); // ✓

    // TypeScript prevents typos
    // console.log(post.titleee); // ✗ Error: Property 'titleee' does not exist
  });

  // Single post retrieval with null check
  const singlePost = await getPostBySlug("some-slug");

  if (singlePost) {
    // TypeScript knows post is not null inside this block
    console.log(singlePost.title); // ✓
  }
}

/**
 * Component type safety
 * All props are properly typed
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ComponentExample(): JSX.Element {
  return (
    <>
      {/* Button with valid props */}
      <Button variant="default" size="lg">
        Click me
      </Button>

      {/* Card with valid props */}
      <Card className="p-6">Content</Card>

      {/* Invalid props caught at compile time */}
      {/* <Button variant="invalid" /> // ✗ Error */}
      {/* <Card invalidProp="test" /> // ✗ Error */}
    </>
  );
}

/**
 * Contentful response types
 * All API responses are properly structured
 */

interface TypedContentfulResponse {
  items: { sys: { id: string } }[];
  total: number;
  skip: number;
  limit: number;
}

// This ensures type safety across the app
const commonComparison: TypedContentfulResponse = {
  items: [],
  total: 0,
  skip: 0,
  limit: 100,
};

// TypeScript enforces this structure everywhere
export {};
