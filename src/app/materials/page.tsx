'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiBook, FiArrowLeft, FiClock, FiLayers } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function MaterialsListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isReady } = useAuthGuard();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !user) return;
    const fetchSubjects = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        const collegeId = userDoc.data()?.collegeId;
        if (!collegeId) {
          router.push('/dashboard');
          return;
        }

        const snapshot = await getDocs(collection(db, 'college_pdfs', collegeId, 'subjects'));
        setSubjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load materials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [isReady, user, router]);

  if (!isReady || loading) {
    return <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center font-bold text-[#8B6E52]">Loading Materials...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 bg-white border-2 border-[#B48C5A]/30 w-10 h-10 rounded-xl flex items-center justify-center text-[#8B6E52] hover:bg-[#F5E8D4] transition-colors">
          <FiArrowLeft />
        </button>
        <h1 className="text-3xl font-black text-[#2C1A0E] mb-2">College Materials</h1>
        <p className="text-[#8B6E52] font-semibold mb-8">Access AI-generated flashcards, formulas, and quizzes for your coursework.</p>

        {subjects.length === 0 ? (
          <div className="bg-white border-2 border-[#B48C5A]/30 rounded-2xl p-10 text-center text-[#8B6E52] font-bold">
            No materials have been uploaded by your college yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub, i) => (
              <motion.div key={sub.id} whileHover={{ y: -4 }} onClick={() => router.push(`/materials/${sub.id}`)}
                className="bg-white border-2 border-[#B48C5A]/25 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#006B7A] to-[#2E7D52] rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
                  <FiBook size={20} />
                </div>
                <h3 className="font-black text-xl text-[#2C1A0E] leading-tight mb-2">{sub.subjectName}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-[#8B6E52]">
                  <span className="flex items-center gap-1 bg-[#F5E8D4] px-2 py-1 rounded-md"><FiLayers /> Sem {sub.semester}</span>
                  <span className="flex items-center gap-1 bg-[#F5E8D4] px-2 py-1 rounded-md"><FiClock /> {sub.totalTopics} Topics</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
