'use client';

import dynamic from 'next/dynamic';

// Disable SSR for the entire page — useSession() from next-auth
// breaks during static prerendering on Vercel.
const VitalMindApp = dynamic(() => import('@/components/vitalmind/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2e44]">
      <div className="flex flex-col items-center gap-3">
        <img src="/vitalmind_logo.png" alt="VitalMind" className="h-12 w-auto rounded-xl animate-pulse" />
      </div>
    </div>
  ),
});

export default function Page() {
  return <VitalMindApp />;
}
