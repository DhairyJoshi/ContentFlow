import React from "react";
import { BlogPost, ContentfulResponse } from "@/lib/types";
import { getPosts, getPostBySlug } from "@/lib/contentful";

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