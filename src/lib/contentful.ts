import { BlogPost, ContentfulBlogResponseItem, ContentfulResponse } from "./types";

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    "Missing Contentful environment variables. Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN"
  );
}

const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;

async function fetchContentful<T>(query: string): Promise<T> {
  const url = `${CONTENTFUL_API_URL}/entries?${query}&access_token=${CONTENTFUL_ACCESS_TOKEN}`;

  const response = await fetch(url, {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Contentful API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function mapContentfulToBlogPost(
  item: ContentfulBlogResponseItem
): BlogPost {
  const { fields } = item;
  return {
    id: item.sys.id,
    title: fields.title || "",
    slug: fields.slug || "",
    excerpt: fields.excerpt || "",
    content: fields.content || "",
    coverImage: fields.coverImage?.fields?.file
      ? {
          url: `https:${fields.coverImage.fields.file.url}`,
          title: fields.coverImage.fields.title,
        }
      : null,
    publishedDate: fields.publishedDate || new Date().toISOString(),
  };
}

export async function getPosts(limit: number = 100): Promise<BlogPost[]> {
  const params: Record<string, string> = {
    content_type: "blogPost",
  };
  
  if (limit && limit !== 100) {
    params.limit = limit.toString();
  }
  
  const query = new URLSearchParams(params).toString();

  const data = await fetchContentful<
    ContentfulResponse<ContentfulBlogResponseItem>
  >(query);

  return data.items.map(mapContentfulToBlogPost).sort((a, b) => {
    return (
      new Date(b.publishedDate).getTime() -
      new Date(a.publishedDate).getTime()
    );
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = new URLSearchParams({
    content_type: "blogPost",
    "fields.slug": slug,
  }).toString();

  const data = await fetchContentful<
    ContentfulResponse<ContentfulBlogResponseItem>
  >(query);

  if (data.items.length === 0) {
    return null;
  }

  return mapContentfulToBlogPost(data.items[0]);
}

export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  const posts = await getPosts(count);
  return posts.slice(0, count);
}

export async function getEntryById(entryId: string): Promise<BlogPost | null> {
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}?access_token=${CONTENTFUL_ACCESS_TOKEN}`;

  const response = await fetch(url, {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `Contentful API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json() as ContentfulBlogResponseItem;
  return mapContentfulToBlogPost(data);
}