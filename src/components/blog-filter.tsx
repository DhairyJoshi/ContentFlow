'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useTransition, ChangeEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from 'lucide-react';

export function BlogFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    replace(`${pathname}?${params.toString()}`);
  }, [pathname, replace, searchParams]);

  const hasQuery = searchParams.get('query');

  return (
    <div className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary/60 transition-colors" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          className="pl-10 pr-10"
          defaultValue={hasQuery?.toString() || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isPending && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
          {hasQuery && !isPending && (
            <button
              onClick={clearSearch}
              className="text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 hover:bg-muted rounded-md"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}