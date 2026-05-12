'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiDownload, FiLinkedin, FiGithub, FiShield, FiArrowLeft, FiCheckCircle, FiAward 
} from 'react-icons/fi';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [userName, setUserName] = React.useState('Verified Candidate');
  const [courseTitle, setCourseTitle] = React.useState('Neural Engineering Specialist');
  const [qrDataUrl, setQrDataUrl] = React.useState('');

  React.useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.displayName || data.fullName || 'Verified Candidate');
          setCourseTitle(data.learningPath || 'Neural Engineering Specialist');
        }
      } catch (e) {
        console.error("Error fetching profile for certificate:", e);
      }
    };
    fetchProfile();
    
    // Generate QR for the current URL
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href).then(setQrDataUrl).catch(console.error);
    }
  }, [user]);

  const handleDownload = () => {
    toast.info("Generating Neural PDF Asset...");
    // Trigger print which can be saved as PDF
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6 lg:p-12 flex flex-col items-center justify-center">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full p-8 flex items-center justify-between z-50 print:hidden">
         <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-white transition-colors">
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
          className="relative glass-card !p-16 text-center space-y-10 border-2 border-[#7C3AED]/30 shadow-[0_0_100px_rgba(124,58,237,0.1)] overflow-hidden bg-[#111]"
        >
           {/* DECORATIVE ELEMENTS */}
           <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#7C3AED]/20" />
           <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#7C3AED]/20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <FiShield size={400} />
           </div>

           <div className="space-y-4">
              <div className="flex justify-center mb-10">
                 <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center">
                   <FiAward className="text-4xl text-[#7C3AED]" />
                 </div>
              </div>
              <h1 className="text-xs font-black uppercase tracking-[0.6em] text-[#A78BFA]">Certificate of Completion</h1>
              <p className="text-muted font-medium text-sm">This verifies that the neural operative</p>
           </div>

           <div className="space-y-2">
              <h2 className="text-5xl font-black tracking-tighter">{userName}</h2>
              <div className="w-20 h-1 bg-[#7C3AED] mx-auto" />
           </div>

           <div className="space-y-3">
              <p className="text-muted font-medium">has successfully mastered the curriculum for</p>
              <h3 className="text-2xl font-black text-white px-8 py-3 bg-white/5 inline-block rounded-xl border border-white/5">
                 {courseTitle}
              </h3>
           </div>

           <div className="grid grid-cols-2 gap-12 pt-10">
              <div className="text-left space-y-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted">AI Proficiency Score</span>
                 <div className="flex items-center gap-3">
                    <span className="text-3xl font-black">87<span className="text-sm opacity-30">/100</span></span>
                    <FiCheckCircle className="text-emerald-500" />
                 </div>
              </div>
              <div className="text-right space-y-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted">Verification QR</span>
                 <div className="flex justify-end">
                   {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 rounded-lg border-2 border-white/10" />}
                 </div>
              </div>
           </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="flex grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-20 print:hidden">
           <button onClick={handleDownload} className="btn-primary !py-5 flex items-center justify-center gap-3">
              <FiDownload size={20} /> Download PDF
           </button>
           <button onClick={shareLinkedIn} className="btn-ghost !bg-white/5 !py-5 flex items-center justify-center gap-3 hover:!bg-[#0077B5] hover:!border-[#0077B5]">
              <FiLinkedin size={20} /> Share on LinkedIn
           </button>
           <button className="btn-ghost !bg-white/5 !py-5 flex items-center justify-center gap-3 hover:!bg-white hover:!text-black">
              <FiGithub size={20} /> View on GitHub
           </button>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .glass-card { border: 1px solid #eee !important; box-shadow: none !important; color: black !important; background: white !important; }
          .text-muted { color: #666 !important; }
          #A78BFA { color: #7C3AED !important; }
          .bg-white\/5 { background: #f9f9f9 !important; border: 1px solid #eee !important; }
          .text-white { color: black !important; }
        }
      `}</style>

    </div>
  );
}
