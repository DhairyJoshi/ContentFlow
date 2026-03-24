import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPostBySlug } from '@/lib/contentful';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 });
  }

  (await draftMode()).enable();
  redirect(`/blogs/${slug}`);
}
