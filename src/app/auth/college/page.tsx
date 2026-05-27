'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiMapPin, FiPhone, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function CollegeSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const UNIVERSITY_TYPES = [
    'Autonomous',
    'Government',
    'JNTU Affiliated',
    'Deemed University',
    'Private University',
    'Regional University',
  ] as const;

  const STUDENT_ID_FORMATS = [
    'YY-Branch-Number (21CS001)',
    'Branch-YY-Number (CS21001)',
    'Custom',
  ] as const;

  const [formData, setFormData] = useState({
    collegeName: '',
    city: '',
    state: '',
    type: 'Engineering College',
    universityType: 'JNTU Affiliated' as (typeof UNIVERSITY_TYPES)[number],
    universityAffiliation: '',
    registrationNumber: '',
    studentIdFormat: 'YY-Branch-Number (21CS001)' as (typeof STUDENT_ID_FORMATS)[number],
    adminName: '',
    email: '',
    phone: '',
    collegeCode: '',
    password: ''
  });

  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [emailWarning, setEmailWarning] = useState(false);

  useEffect(() => {
    // Check email format
    if (formData.email) {
      if (!formData.email.endsWith('.edu') && !formData.email.endsWith('.ac.in')) {
        setEmailWarning(true);
      } else {
        setEmailWarning(false);
      }
    } else {
      setEmailWarning(false);
    }
  }, [formData.email]);

  useEffect(() => {
    const checkCode = async () => {
      const code = formData.collegeCode;
      if (!code) {
        setCodeStatus('idle');
        return;
      }
      
      const isValidFormat = /^[a-zA-Z0-9]{6,10}$/.test(code);
      if (!isValidFormat) {
        setCodeStatus('invalid');
        return;
      }

      setCodeStatus('checking');
      try {
        const response = await fetch(`/api/college/check-code?code=${encodeURIComponent(code)}`);
        if (!response.ok) {
          throw new Error('Failed to verify college code');
        }
        const data = await response.json();
        if (data.available) {
          setCodeStatus('available');
        } else {
          setCodeStatus('taken');
        }
      } catch (err) {
        console.error("Code availability check failed:", err);
        setCodeStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkCode, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.collegeCode]);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 10000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      showError('System initialization failed. Refreshing...');
      window.location.reload();
      return;
    }

    if (codeStatus === 'taken') {
      showError(`This code is taken. Try ${formData.collegeCode.substring(0, 6).toUpperCase()}2025 or ${formData.collegeCode.substring(0, 6).toUpperCase()}_CSE`);
      return;
    }
    
    if (codeStatus === 'invalid') {
      showError('College code must be 6-10 characters long and contain only letters and numbers.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Step 1: Starting college registration flow');

      // 1. Double check uniqueness right before creating user using API endpoint
      const response = await fetch(`/api/college/check-code?code=${encodeURIComponent(formData.collegeCode)}`);
      if (!response.ok) {
        throw new Error('Failed to verify college code availability.');
      }
      const data = await response.json();
      if (!data.available) {
        setLoading(false);
        setCodeStatus('taken');
        showError(`This code is taken. Try ${formData.collegeCode.substring(0, 6).toUpperCase()}2025 or ${formData.collegeCode.substring(0, 6).toUpperCase()}_CSE`);
        return;
      }

      // 2. Create Firebase Auth user FIRST
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = result.user;
      console.log('Step 2: Firebase Auth user created:', user.uid);

      // Wait for auth state to be confirmed
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (confirmedUser) => {
          if (confirmedUser) {
            unsubscribe();
            resolve(confirmedUser);
          }
        });
      });
      console.log('Step 2.5: Firebase Auth state confirmed');

      // 3. Write to colleges/{user.uid}
      const collegePath = 'colleges/' + user.uid;
      console.log('Step 3: Writing to Firestore path:', collegePath);
      const collegeData = {
        collegeName: formData.collegeName,
        city: formData.city,
        state: formData.state,
        type: formData.type,
        institutionType: formData.type,
        universityType: formData.universityType,
        universityAffiliation: formData.universityAffiliation.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        studentIdFormat: formData.studentIdFormat,
        adminName: formData.adminName,
        email: formData.email,
        phone: formData.phone,
        collegeCode: formData.collegeCode,
        adminUid: user.uid,
        createdAt: serverTimestamp(),
        totalStudents: 0,
        role: 'college'
      };
      console.log('Step 4: Data being written:', collegeData);
      await setDoc(doc(db, 'colleges', user.uid), collegeData);
      console.log('Step 5: colleges document written successfully');

      // 4. Write to users/{user.uid}
      await setDoc(doc(db, 'users', user.uid), {
        role: 'college',
        collegeId: user.uid,
        collegeName: formData.collegeName,
        collegeCode: formData.collegeCode,
        email: formData.email,
        displayName: formData.adminName,
        createdAt: serverTimestamp()
      });
      console.log('Step 6: users document written successfully');

      console.log('SUCCESS: College and User documents created successfully!', {
        collegeId: user.uid,
        userId: user.uid,
        role: 'college'
      });

      router.push('/college/dashboard');
    } catch (err: any) {
      console.error("College Signup Error:", err);
      const msg = err.code === 'auth/email-already-in-use' ? 'Email already registered. Please sign in.'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err.message || 'Signup failed. Please try again.';
      showError(msg);
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#EDE4D3',
    border: '1.5px solid rgba(120,80,40,0.25)',
    boxShadow: 'inset 0 2px 6px rgba(100,60,20,0.1), 0 1px 0 rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: '13px 16px 13px 44px',
    fontSize: 14,
    fontWeight: 500,
    color: '#2C1A0E',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3,
        backgroundImage: 'radial-gradient(circle, rgba(0,107,122,0.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 540,
          backgroundColor: 'var(--surface-raised)',
          borderRadius: 28,
          border: '2px solid rgba(180,140,90,0.3)',
          padding: 48,
          boxShadow: '0 4px 0 rgba(255,255,255,0.9) inset, 0 20px 60px rgba(140,90,40,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Image src="/logo.webp" alt="Path Pilot" width={40} height={40} className="object-contain" />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E' }}>Path Pilot</span>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: 24, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 6 }}>
          Register Institution
        </h2>
        <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
          Join Path Pilot to track and guide your students' careers.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(217,95,43,0.1)', border: '1.5px solid rgba(217,95,43,0.3)', borderRadius: 12, padding: '12px 16px', color: '#B04A1E', fontSize: 13, fontWeight: 600, marginBottom: 20 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <FiMapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type="text" placeholder="Institution full name (e.g. Vignan University)" required
              value={formData.collegeName}
              onChange={e => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" placeholder="City" required
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                style={{ ...inputStyle, paddingLeft: 16 }}
              />
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" placeholder="State" required
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                style={{ ...inputStyle, paddingLeft: 16 }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
              style={{ ...inputStyle, paddingLeft: 16, cursor: 'pointer', appearance: 'none' }}
              required
            >
              <option value="Engineering College">Engineering College</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="University">University</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={formData.universityType}
              onChange={e => setFormData(prev => ({ ...prev, universityType: e.target.value as (typeof UNIVERSITY_TYPES)[number] }))}
              style={{ ...inputStyle, paddingLeft: 16, cursor: 'pointer', appearance: 'none' }}
              required
            >
              {UNIVERSITY_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="University / Board affiliation (e.g. JNTU Kakinada)"
              required
              value={formData.universityAffiliation}
              onChange={e => setFormData(prev => ({ ...prev, universityAffiliation: e.target.value }))}
              style={{ ...inputStyle, paddingLeft: 16 }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Registration / NAAC number"
              required
              value={formData.registrationNumber}
              onChange={e => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
              style={{ ...inputStyle, paddingLeft: 16 }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={formData.studentIdFormat}
              onChange={e => setFormData(prev => ({ ...prev, studentIdFormat: e.target.value as (typeof STUDENT_ID_FORMATS)[number] }))}
              style={{ ...inputStyle, paddingLeft: 16, cursor: 'pointer', appearance: 'none' }}
              required
            >
              {STUDENT_ID_FORMATS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type="text" placeholder="Admin Full Name" required
              value={formData.adminName}
              onChange={e => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type="tel" placeholder="Phone Number" required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
              <input type="email" placeholder="Official Email address" required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <AnimatePresence>
              {emailWarning && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#D97706', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiInfo /> Consider using a .edu or .ac.in email for faster verification.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#8B6E52', fontSize: 13 }}>CODE</div>
              <input type="text" placeholder="Choose College Code" required
                value={formData.collegeCode}
                onChange={e => setFormData(prev => ({ ...prev, collegeCode: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                style={{ ...inputStyle, paddingLeft: 60, paddingRight: 40 }}
                maxLength={10}
              />
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                {codeStatus === 'checking' && <span style={{ fontSize: 12, color: '#8B6E52' }}>...</span>}
                {codeStatus === 'available' && <FiCheck color="#10B981" />}
                {(codeStatus === 'taken' || codeStatus === 'invalid') && <FiX color="#EF4444" />}
              </div>
            </div>
            <p style={{ 
              margin: '6px 0 0', 
              fontSize: 12, 
              color: codeStatus === 'available' ? '#10B981' : (codeStatus === 'taken' || codeStatus === 'invalid') ? '#EF4444' : '#8B6E52',
              fontWeight: 600
            }}>
              {codeStatus === 'idle' && 'Min 6, Max 10 chars, letters/numbers only. Students will use this to join.'}
              {codeStatus === 'checking' && 'Checking availability...'}
              {codeStatus === 'available' && '✓ Available'}
              {codeStatus === 'taken' && `✗ This code is taken. Try ${formData.collegeCode}2025`}
              {codeStatus === 'invalid' && '✗ Code must be 6-10 characters, letters and numbers only, no spaces'}
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              style={{ ...inputStyle, paddingRight: 48 }}
              minLength={6}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8B6E52' }}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" disabled={loading || codeStatus === 'taken' || codeStatus === 'invalid'} style={{
            width: '100%', padding: '14px 0', fontSize: 14, marginTop: 8,
            background: 'linear-gradient(180deg, #008FA3 0%, #006B7A 50%, #005060 100%)',
            color: '#fff', border: '1px solid rgba(0,40,50,0.4)', borderRadius: 14, cursor: (loading || codeStatus === 'taken' || codeStatus === 'invalid') ? 'not-allowed' : 'pointer',
            fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
            boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 6px 14px rgba(0,60,80,0.35)',
            transition: 'all 0.18s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            {loading ? 'REGISTERING...' : 'REGISTER INSTITUTION →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8B6E52', fontWeight: 500 }}>
          Already registered?{' '}
          <button onClick={() => router.push('/auth')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#006B7A', fontWeight: 800 }}>
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
