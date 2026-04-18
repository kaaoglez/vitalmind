'use client';

import dynamic from 'next/dynamic';

// Disable SSR for the entire page — useSession() from next-auth
// breaks during static prerendering on Vercel.
const VitalMindApp = dynamic(() => import('@/components/vitalmind/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2e44]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
          <span className="text-white text-lg font-bold">V</span>
        </div>
        <span className="text-slate-400 text-sm">VitalMind</span>
      </div>
    </div>
  ),
});

export default function Page() {
  return <VitalMindApp />;
}
