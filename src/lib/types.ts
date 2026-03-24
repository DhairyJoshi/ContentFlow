export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    title?: string;
  } | null;
  publishedDate: string;
}

export interface ContentfulBlogResponseItem {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    coverImage?: {
      sys: {
        id: string;
      };
      fields?: {
        file?: {
          url: string;
        };
        title?: string;
      };
    };
    publishedDate?: string;
  };
}

export interface ContentfulResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  includes?: {
    Asset?: Array<{
      sys: { id: string };
      fields: {
        file: { url: string };
        title?: string;
      };
    }>;
  };
}