import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Not Found | Blog",
  description: "The blog post you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="text-center py-16 space-y-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Blog post not found
      </p>
      <a
        href="/blog"
        className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Blog
      </a>
    </div>
  );
}