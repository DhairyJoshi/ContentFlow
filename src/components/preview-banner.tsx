import { draftMode } from 'next/headers';
import Link from 'next/link';

export default async function PreviewBanner() {
  try {
    const { isEnabled } = await draftMode();
    
    if (!isEnabled) {
      return null;
    }

    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-10 bg-yellow-400 text-yellow-900 text-sm font-medium px-4">
        <span>Draft Mode is Enabled</span>
        <span className="mx-2">•</span>
        <a href="/api/disable-draft" className="underline hover:text-yellow-950">
          Disable custom preview
        </a>
      </div>
    );
  } catch (error) {
    return null;
  }
}