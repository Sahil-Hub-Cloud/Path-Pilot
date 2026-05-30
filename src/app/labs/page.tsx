'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LABS, LAB_IDS_ORDERED, getCourseLabIds } from '@/lib/data/labs';
import { getCourseIdFromLabel } from '@/lib/data/course-map';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FiTerminal, FiArrowRight, FiStar, FiArrowLeft } from 'react-icons/fi';

export default function LabsListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user) {
      setCourseId(null);
      return;
    }
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        const path = snap.exists() ? (snap.data().learningPath as string) : null;
        setCourseId(getCourseIdFromLabel(path));
      })
      .catch(() => setCourseId(null));
  }, [user]);

  const trackLabIds = courseId ? getCourseLabIds(courseId) : [];
  const visibleIds = showAll || !courseId
    ? LAB_IDS_ORDERED
    : trackLabIds.filter((id) => LABS[id]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050911] text-gray-900 dark:text-[#E8E8F0] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 px-3 py-2 bg-[#FDF6EC] dark:bg-white/5 border border-[#B48C5A]/20 dark:border-white/10 rounded-xl cursor-pointer text-gray-600 dark:text-[#888899] text-xs font-bold hover:bg-white dark:hover:bg-white/10 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Dashboard
        </button>

        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center gap-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#006B7A]/10 dark:bg-cyan-500/10 text-[#006B7A] dark:text-cyan-500 flex-shrink-0 mx-auto md:mx-0">
            <FiTerminal size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Interactive Labs</h1>
            <p className="text-gray-600 dark:text-[#888899] text-sm md:text-base max-w-2xl">
              {courseId && !showAll
                ? `Labs for your track (${courseId.replace(/-/g, ' ')}). Complete them to earn XP.`
                : 'Hands-on coding challenges matched to your learning track.'}
            </p>
          </div>
        </header>

        {courseId && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                !showAll
                  ? 'bg-[#006B7A] text-white border-[#006B7A]'
                  : 'bg-transparent border-[#B48C5A]/30 text-gray-600'
              }`}
            >
              My Track
            </button>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                showAll
                  ? 'bg-[#006B7A] text-white border-[#006B7A]'
                  : 'bg-transparent border-[#B48C5A]/30 text-gray-600'
              }`}
            >
              All Labs
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleIds.map((id) => {
            const lab = LABS[id];
            if (!lab) return null;

            return (
              <div
                key={id}
                onClick={() => router.push(`/labs/${id}`)}
                className="bg-[#FDF6EC] dark:bg-[#16161E] border-2 border-[#B48C5A]/20 dark:border-white/10 rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#006B7A]/5 dark:bg-cyan-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />

                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-white dark:bg-black/20 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 border-[#B48C5A]/10 dark:border-white/5">
                    {lab.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#D95F2B] dark:text-[#F59E0B] text-xs font-black">
                    <FiStar /> {lab.xp} XP
                  </div>
                </div>

                <h3 className="text-lg font-black mb-2 leading-tight group-hover:text-[#006B7A] dark:group-hover:text-cyan-400 transition-colors">
                  {lab.title}
                </h3>

                <div className="flex items-center gap-3 mt-auto pt-6 text-[10px] font-black text-gray-500 dark:text-[#555566]">
                  <span
                    className={`px-2 py-1 rounded-md uppercase tracking-wider ${
                      lab.difficulty === 'Easy'
                        ? 'text-green-700 bg-green-100 dark:bg-green-500/10 dark:text-green-400'
                        : lab.difficulty === 'Medium'
                          ? 'text-orange-700 bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400'
                          : 'text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400'
                    }`}
                  >
                    {lab.difficulty}
                  </span>
                  <span className="uppercase tracking-widest bg-white dark:bg-black/20 px-2 py-1 rounded-md border border-[#B48C5A]/10 dark:border-white/5">
                    {lab.defaultLang}
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#006B7A] dark:text-cyan-400">
                  <FiArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
