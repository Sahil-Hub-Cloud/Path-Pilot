'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TalentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/leaderboard');
  }, [router]);
  return null;
}
