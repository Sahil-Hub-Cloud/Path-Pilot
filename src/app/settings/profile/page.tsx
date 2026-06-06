'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FiUpload, FiCheck, FiUser, FiBookOpen, FiShield } from 'react-icons/fi';
import Image from 'next/image';

const S = {
  bg: '#FDF6EC',
  card: '#FFFFFF',
  border: 'rgba(180,140,90,0.25)',
  text: '#2C1A0E',
  sub: '#8B6E52',
  muted: '#B89A7E',
  teal: '#006B7A',
  green: '#2E7D52',
  input: '#F9F2E8',
};

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%',
  background: S.input,
  border: `1.5px solid ${focused ? S.teal : S.border}`,
  borderRadius: 12,
  padding: '13px 16px',
  fontSize: 14,
  fontWeight: 600,
  color: S.text,
  outline: 'none',
  transition: 'all 0.2s',
  boxShadow: focused ? `0 0 0 3px rgba(0,107,122,0.1)` : 'inset 0 2px 4px rgba(100,60,20,0.04)',
});

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { isReady } = useAuthGuard();
  
  const [data, setData] = useState({
    displayName: '',
    collegeCode: '',
    collegeName: '',
    yearOfStudy: '',
    showProfileToAdmins: true,
    profileImageUrl: ''
  });
  
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const uData = docSnap.data();
          setData({
            displayName: uData.displayName || '',
            collegeCode: uData.collegeCode || '',
            collegeName: uData.collegeName || '',
            yearOfStudy: uData.yearOfStudy?.toString() || '',
            showProfileToAdmins: uData.showProfileToAdmins ?? true,
            profileImageUrl: uData.profileImageUrl || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleCodeBlur = async () => {
    setFocus('');
    if (!data.collegeCode) {
      setData(prev => ({ ...prev, collegeName: '' }));
      setCodeError('');
      return;
    }
    
    try {
      const res = await fetch(`/api/college/check-code?code=${data.collegeCode}`);
      const result = await res.json();
      if (result.exists) {
        setData(prev => ({ ...prev, collegeName: result.collegeName }));
        setCodeError('');
      } else {
        setCodeError('Invalid College Code');
        setData(prev => ({ ...prev, collegeName: '' }));
      }
    } catch (err) {
      console.error(err);
      setCodeError('Error checking code');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Quick validation
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        () => {}, // progress
        (err) => {
          setUploading(false);
          setError('Failed to upload image');
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setData(prev => ({ ...prev, profileImageUrl: url }));
          
          // Optionally update Firestore immediately
          await updateDoc(doc(db, 'users', user.uid), {
            profileImageUrl: url
          });
          
          setUploading(false);
        }
      );
    } catch (err) {
      setUploading(false);
      setError('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!data.displayName.trim()) {
      setError('Name is required');
      return;
    }
    if (data.collegeCode && !data.yearOfStudy) {
      setError('Year of Study is required when linked to a college');
      return;
    }
    if (codeError) {
      setError('Please fix the college code error');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: data.displayName,
        collegeCode: data.collegeCode || null,
        collegeName: data.collegeName || null,
        yearOfStudy: data.yearOfStudy ? parseInt(data.yearOfStudy, 10) : null,
        showProfileToAdmins: data.showProfileToAdmins,
        profileImageUrl: data.profileImageUrl
      });

      // Link profile in Supabase
      await fetch('/api/college/link-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          fullName: data.displayName,
          collegeCode: data.collegeCode,
          collegeName: data.collegeName,
          yearOfStudy: data.yearOfStudy,
          profileImageUrl: data.profileImageUrl,
          showProfileToAdmins: data.showProfileToAdmins
        })
      });

      // Need a success state/toast ideally, we'll just alert for now or show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isReady || loading) {
    return <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: S.bg, padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: S.text, marginBottom: 24 }}>Profile Settings</h1>
        
        <div style={{ background: S.card, borderRadius: 24, padding: 32, border: `1.5px solid ${S.border}`, boxShadow: '0 8px 32px rgba(140,90,40,0.08)' }}>
          
          {/* Profile Picture */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: 50, background: S.input, border: `2px solid ${S.border}`, overflow: 'hidden', position: 'relative' }}>
              {data.profileImageUrl ? (
                <Image src={data.profileImageUrl} alt="Profile" fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.muted }}>
                  <FiUser size={40} />
                </div>
              )}
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 20, height: 20, border: `3px solid ${S.teal}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
              <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 20px', background: S.input, border: `1px solid ${S.border}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: S.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiUpload /> Upload Avatar
              </button>
              <div style={{ fontSize: 12, color: S.muted, marginTop: 8 }}>Recommended: 400x400px</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Display Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: S.sub, marginBottom: 6 }}>Full Name</label>
              <input value={data.displayName} onChange={e => setData({ ...data, displayName: e.target.value })}
                onFocus={() => setFocus('name')} onBlur={() => setFocus('')}
                placeholder="Your Name" style={inputStyle(focus === 'name')} />
            </div>

            {/* College Code */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: S.sub, marginBottom: 6 }}>College Code (Optional)</label>
              <input value={data.collegeCode} 
                onChange={e => setData({ ...data, collegeCode: e.target.value.toUpperCase() })}
                onFocus={() => setFocus('code')} 
                onBlur={handleCodeBlur}
                placeholder="e.g. VIG284" style={inputStyle(focus === 'code')} />
              {codeError && <div style={{ fontSize: 12, color: '#B04A1E', marginTop: 6, fontWeight: 600 }}>{codeError}</div>}
            </div>

            {/* College Name (Auto-filled) */}
            {data.collegeName && (
              <div style={{ background: '#EDE4D3', padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: S.text, fontSize: 14, fontWeight: 600 }}>
                <FiBookOpen color={S.teal} />
                Linked to: {data.collegeName}
              </div>
            )}

            {/* Year of Study */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: S.sub, marginBottom: 6 }}>Year of Study {data.collegeCode && '*'}</label>
              <select value={data.yearOfStudy} onChange={e => setData({ ...data, yearOfStudy: e.target.value })}
                onFocus={() => setFocus('year')} onBlur={() => setFocus('')}
                style={{ ...inputStyle(focus === 'year'), appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Privacy Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: S.input, borderRadius: 12, border: `1px solid ${S.border}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: S.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiShield color={S.teal} /> Share with College Admins
                </div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>
                  Allow admins to see your progress and metrics
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                <input type="checkbox" checked={data.showProfileToAdmins} onChange={e => setData({ ...data, showProfileToAdmins: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: data.showProfileToAdmins ? S.teal : '#D1C4B5', borderRadius: 24, transition: '.4s' }}>
                  <span style={{ position: 'absolute', height: 18, width: 18, left: data.showProfileToAdmins ? 22 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '.4s' }} />
                </span>
              </label>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(176,74,30,0.08)', color: '#B04A1E', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{ marginTop: 10, padding: '14px', background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              {saving ? 'Saving...' : <><FiCheck /> Save Changes</>}
            </button>

          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
