'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiLinkedin, FiGithub, FiShield, FiArrowLeft, FiCheckCircle, FiAward, FiLock, FiCpu, FiTrendingUp
} from 'react-icons/fi';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import { COURSES, getCourseIdFromLabel, getRoadmapKey } from '@/lib/data/course-map';

import { ROADMAPS } from '@/lib/data/roadmaps';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [remainingTopics, setRemainingTopics] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const validateCertificate = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          
          const courseId = getCourseIdFromLabel(data.learningPath);
          const roadmapId = getRoadmapKey(courseId);
          const roadmap = ROADMAPS[roadmapId];
          setCourseData(roadmap);

          if (roadmap) {
            const allTopics = roadmap.chapters.flatMap((ch: any) => ch.topics);
            const completedTopics = data.completedTopics || [];
            
            // Check if all roadmap topics are in the completed list
            const completedSet = new Set(completedTopics);
            const incomplete = allTopics.filter((t: any) => !completedSet.has(t.id));
            
            setRemainingTopics(incomplete.length);
            setIsComplete(incomplete.length === 0);
          }
        }
      } catch (e) {
        console.error("Error validating certificate:", e);
        toast.error("Failed to sync neural credentials.");
      } finally {
        setLoading(false);
      }
    };

    validateCertificate();
    
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href).then(setQrDataUrl).catch(console.error);
    }
  }, [user]);

  const handleDownload = () => {
    toast.info("Generating Neural PDF Asset...");
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const shareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566]">Validating Neural Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isComplete) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 text-center">
        <nav className="fixed top-0 left-0 w-full p-8 flex items-center justify-between z-50">
           <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#555566] hover:text-white transition-colors">
              <FiArrowLeft /> Back to Dashboard
           </button>
        </nav>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-800/5 rounded-[2rem] border-2 border-white/10 flex items-center justify-center relative">
              <FiLock className="text-4xl text-[#555566]" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg border-4 border-[#0D0D0D]">
                <FiCpu className="text-white text-xs" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-black tracking-tight">Certificate Locked</h1>
            <p className="text-[#888899] text-sm leading-relaxed font-medium">
              Complete your course to unlock your certificate.<br />
              <span className="text-[#A78BFA] font-bold">{remainingTopics} topics</span> remaining in your roadmap.
            </p>
          </div>

          <div className="p-1 bg-white dark:bg-gray-800/5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                    <FiTrendingUp size={16} />
                 </div>
                 <div className="text-left">
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#555566]">Your Score</div>
                   <div className="text-sm font-black">{profile?.employabilityScore || 0}/100</div>
                 </div>
               </div>
               <button onClick={() => router.push(`/learn/${getCourseIdFromLabel(profile?.learningPath)}`)} className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                  Resume Path
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const studentName = profile?.displayName || profile?.fullName || user?.displayName || 'Scholar';
  const courseName = courseData?.title || profile?.learningPath || 'Professional Program';
  const employabilityScore = profile?.employabilityScore || 0;
  const completionDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6 lg:p-12 flex flex-col items-center justify-center">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full p-8 flex items-center justify-between z-50 print:hidden">
         <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#555566] hover:text-white transition-colors">
            <FiArrowLeft /> Back to Dashboard
         </button>
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7C3AED] rounded flex items-center justify-center font-black">P</div>
            <span className="font-bold tracking-tight">Path Pilot</span>
         </div>
      </nav>

      <div className="max-w-4xl w-full pt-20">
        
        {/* CERTIFICATE CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative glass-card !p-12 md:!p-16 text-center space-y-10 border-2 border-[#7C3AED]/30 shadow-[0_0_100px_rgba(124,58,237,0.1)] overflow-hidden bg-[#111]"
        >
           {/* DECORATIVE ELEMENTS */}
           <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#7C3AED]/20" />
           <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#7C3AED]/20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <FiShield size={400} />
           </div>

           <div className="space-y-4">
              <div className="flex justify-center mb-8">
                 <div className="w-20 h-20 bg-white dark:bg-gray-800/5 rounded-2xl flex items-center justify-center relative">
                    <FiAward className="text-4xl text-[#7C3AED]" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#111]">
                       <FiCheckCircle className="text-white text-[10px]" />
                    </div>
                 </div>
              </div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A78BFA]">Certificate of Excellence</h1>
              <p className="text-[#888899] font-medium text-xs md:text-sm tracking-wide">This specialized credential is awarded to</p>
           </div>

           <div className="space-y-3">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{studentName}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mx-auto" />
           </div>

           <div className="space-y-4">
              <p className="text-[#888899] font-medium text-xs md:text-sm">for mastering the comprehensive curriculum and technical labs of</p>
              <h3 className="text-xl md:text-3xl font-black text-white px-8 py-4 bg-white dark:bg-gray-800/5 inline-block rounded-2xl border border-white/5 shadow-inner">
                 {courseName}
              </h3>
           </div>

           <div className="grid grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div className="text-left space-y-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566]">Employability Index</span>
                 <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl font-black">{employabilityScore}<span className="text-sm opacity-20 font-bold ml-1">/100</span></span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <div className="text-[9px] font-bold text-[#10B981] uppercase tracking-widest">Verified by Path Pilot AI</div>
              </div>
              <div className="text-right space-y-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566]">Completion Date</span>
                 <div className="text-lg md:text-xl font-bold text-white/90">{completionDate}</div>
                 <div className="text-[9px] font-bold text-[#555566] uppercase tracking-widest">Certificate ID: {params.id}</div>
              </div>
           </div>

           {/* QR Section */}
           <div className="flex justify-center pt-8">
              <div className="p-3 bg-white dark:bg-gray-800/5 border border-white/10 rounded-2xl">
                 {qrDataUrl && <img src={qrDataUrl} alt="Verification" className="w-16 h-16 opacity-80" />}
              </div>
           </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-20 print:hidden">
           <button onClick={handleDownload} className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-black dark:text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#7C3AED] hover:text-white transition-all shadow-xl shadow-white/5">
              <FiDownload size={18} /> Download Credentials
           </button>
           <button onClick={shareLinkedIn} className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800/5 border border-white/10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0077B5] hover:border-[#0077B5] transition-all">
              <FiLinkedin size={18} /> Add to Profile
           </button>
           <button className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800/5 border border-white/10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#24292F] transition-all">
              <FiGithub size={18} /> GitHub Verification
           </button>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
          .min-h-screen { min-height: auto !important; padding: 20mm !important; }
          .glass-card { 
            border: 2px solid #000 !important; 
            box-shadow: none !important; 
            color: black !important; 
            background: white !important;
            padding: 20px !important;
          }
          .text-white { color: black !important; }
          .text-[#888899], .text-[#555566], .text-muted { color: #444 !important; }
          .text-[#A78BFA] { color: #000 !important; font-weight: 900 !important; }
          .bg-white dark:bg-gray-800\/5 { background: #fff !important; border: 1px solid #ddd !important; }
          .w-24.h-1 { background: #000 !important; }
          .bg-white dark:bg-gray-800 { color: black !important; }
          button { display: none !important; }
          .border-t { border-top: 1px solid #000 !important; }
          .border { border: 1px solid #000 !important; }
        }
      `}</style>

    </div>
  );
}
