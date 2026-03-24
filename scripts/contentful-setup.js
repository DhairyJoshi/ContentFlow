#!/usr/bin/env node

/**
 * Contentful Content Model Setup
 * This provides the exact schema needed for the BlogPost content type
 */

const CONTENT_MODEL = {
  name: "BlogPost",
  description: "Blog post with rich text content",
  fields: [
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      localized: false,
      required: true,
      validations: [
        {
          size: {
            min: 1,
            max: 200,
          },
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      localized: false,
      required: true,
      validations: [
        {
          unique: true,
        },
        {
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          message: "Slug must be lowercase with hyphens",
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: "excerpt",
      name: "Excerpt",
      type: "Text",
      localized: false,
      required: false,
      validations: [
        {
          size: {
            max: 500,
          },
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: "content",
      name: "Content",
      type: "RichText",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
    },
    {
      id: "coverImage",
      name: "Cover Image",
      type: "Link",
      localized: false,
      required: false,
      validations: [
        {
          linkMimetypeGroup: ["image"],
        },
      ],
      linkType: "Asset",
      disabled: false,
      omitted: false,
    },
    {
      id: "publishedDate",
      name: "Published Date",
      type: "Date",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
    },
  ],
  displayField: "title",
};

const SAMPLE_POSTS = [
  {
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    excerpt:
      "Learn how to build modern web applications with Next.js 15 and the App Router.",
    publishedDate: new Date("2024-01-15").toISOString(),
    content: "<p>Next.js 15 brings powerful improvements...</p>",
  },
  {
    title: "Contentful CMS Best Practices",
    slug: "contentful-cms-best-practices",
    excerpt:
      "Master content modeling and API usage for optimal Contentful experience.",
    publishedDate: new Date("2024-01-20").toISOString(),
    content: "<p>When working with Contentful, structure matters...</p>",
  },
  {
    title: "TypeScript for Type-Safe Applications",
    slug: "typescript-type-safe-applications",
    excerpt:
      "Discover how TypeScript can improve code quality and developer experience.",
    publishedDate: new Date("2024-01-25").toISOString(),
    content: "<p>TypeScript provides compile-time type checking...</p>",
  },
];

console.log(
  "Contentful Content Model Setup Guide\n" + "====================================\n"
);

console.log("1. Content Type: BlogPost");
console.log("   Description: Blog post with rich text content\n");

console.log("2. Fields:");
CONTENT_MODEL.fields.forEach((field) => {
  console.log(`
   ${field.id.padEnd(15)} | Type: ${field.type.padEnd(10)} | Required: ${field.required ? "✓" : "✗"}`);
  if (field.validations.length > 0) {
    console.log(`                 | Validations: ${JSON.stringify(field.validations[0])}`);
  }
});

console.log("\n\n3. Sample Posts:");
SAMPLE_POSTS.forEach((post, idx) => {
  console.log(`
   Post ${idx + 1}: ${post.title}
   - Slug: ${post.slug}
   - Date: ${post.publishedDate.split("T")[0]}
   - Excerpt: ${post.excerpt.substring(0, 50)}...`);
});

console.log("\n\nManual Setup Instructions:");
console.log("1. Log in to Contentful");
console.log("2. Go to Space > Content model");
console.log("3. Create new Content Type");
console.log('4. Name: "BlogPost"');
console.log("5. Add fields exactly as specified above");
console.log("6. Publish the content type");
console.log("7. Create new entries with sample data");

console.log("\n\nAPI Testing:");
console.log('curl "https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries"');
console.log(
  '  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"'
);
console.log(
  '  -d "content_type=blogPost"'
);

module.exports = { CONTENT_MODEL, SAMPLE_POSTS };
