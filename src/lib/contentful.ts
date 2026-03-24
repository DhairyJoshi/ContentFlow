import { BlogPost, ContentfulBlogResponseItem, ContentfulResponse } from "./types";
import { draftMode } from "next/headers";

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    "Missing Contentful environment variables. Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN"
  );
}

const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;
const CONTENTFUL_PREVIEW_API_URL = `https://preview.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;

async function fetchContentful<T>(query: string, preview: boolean = false): Promise<T> {
  let isDraftMode = preview;
  
  if (!preview) {
    try {
      const { isEnabled } = await draftMode();
      isDraftMode = isEnabled;
    } catch (error) {
    }
  }

  const accessToken = isDraftMode ? CONTENTFUL_PREVIEW_ACCESS_TOKEN : CONTENTFUL_ACCESS_TOKEN;
  const urlBase = isDraftMode ? CONTENTFUL_PREVIEW_API_URL : CONTENTFUL_API_URL;
  
  if (isDraftMode && !accessToken) {
    throw new Error("Missing CONTENTFUL_PREVIEW_ACCESS_TOKEN env variable");
  }

  const url = `${urlBase}/entries?${query}&access_token=${accessToken}`;
  console.log(`Fetching from Contentful (${isDraftMode ? 'Preview' : 'Delivery'} API):`, url);

  const response = await fetch(url, {
    cache: isDraftMode ? 'no-store' : 'force-cache',
    next: {
      tags: ['contentful'],
      revalidate: isDraftMode ? 0 : 3600,
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
  item: ContentfulBlogResponseItem,
  includes?: any
): BlogPost {
  const { fields } = item;

  let coverImage = null;
  if (fields.coverImage) {
    if (fields.coverImage.fields?.file) {
      coverImage = {
        url: `https:${fields.coverImage.fields.file.url}`,
        title: fields.coverImage.fields.title,
      };
    } else if (includes?.Asset && fields.coverImage.sys?.id) {
      const assetId = fields.coverImage.sys.id;
      const asset = includes.Asset.find((a: any) => a.sys.id === assetId);
      if (asset?.fields?.file) {
        coverImage = {
          url: `https:${asset.fields.file.url}`,
          title: asset.fields.title,
        };
      }
    }
  }

  return {
    id: item.sys.id,
    title: fields.title || "",
    slug: fields.slug || "",
    excerpt: fields.excerpt || "",
    content: fields.content || "",
    coverImage,
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

  return data.items
    .map((item) => mapContentfulToBlogPost(item, data.includes))
    .sort((a, b) => {
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

  return mapContentfulToBlogPost(data.items[0], data.includes);
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