'use client';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES, Document } from '@contentful/rich-text-types';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextProps {
  content: Document | string | null | undefined;
  className?: string;
}

function getOptions() {
  return {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-semibold text-foreground">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline underline-offset-4">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
          {text}
        </code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground/90">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-12 mb-6 text-foreground">
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-6 text-foreground">
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground">
          {children}
        </h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-4 text-foreground">
          {children}
        </h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-4 text-foreground">
          {children}
        </h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="scroll-m-20 text-base font-semibold tracking-tight mt-6 mb-4 text-foreground">
          {children}
        </h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground/90">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground/90">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li>{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => (
        <hr className="my-8 border-border" />
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const target = node.data?.target;
        const fields = target?.fields;
        
        if (!fields?.file?.url) {
          return null;
        }

        const imageUrl = fields.file.url;
        const title = fields.title || 'Embedded Asset';
        
        return (
          <div className="relative my-8 rounded-md border bg-muted/50 w-full overflow-hidden">
               <Image 
                  src={`https:${imageUrl}`}
                  alt={title} 
                  width={800}
                  height={450}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                  className="w-full h-auto object-cover"
               />
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data;
        return (
          <Link 
            href={uri} 
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            target={uri.startsWith('http') ? '_blank' : undefined}
            rel={uri.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </Link>
        );
      },
    },
  };
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) {
    return null;
  }

  if (typeof content === 'string') {
    return (
      <div 
        className={cn("prose dark:prose-invert max-w-none", className)} 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  try {
    const options = getOptions();
    const rendered = documentToReactComponents(content, options);
    
    return (
      <div className={cn("rich-text-content", className)}>
        {rendered}
      </div>
    );
  } catch (error) {
    return (
      <div className="prose dark:prose-invert max-w-none text-red-500">
        <p>Error rendering content. Please try again later.</p>
      </div>
    );
  }
}