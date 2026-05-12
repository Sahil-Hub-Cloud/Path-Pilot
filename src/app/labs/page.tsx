'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LabsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first lab in the sequence
    router.replace('/labs/lab-001');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050911] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Initializing Lab Environment...</p>
      </div>
    </div>
  );
}
