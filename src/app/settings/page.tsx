'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiBook, FiTerminal, FiCpu,
  FiTrendingUp, FiUser, FiLogOut, FiSettings,
  FiBell, FiMoon, FiSun, FiTrash2, FiShield,
  FiEdit2, FiLock, FiAlertTriangle, FiCheckCircle, FiInfo, FiAward
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { db, auth } from '@/lib/firebase';
import { fetchResilient } from '@/lib/firestore-resilience';
import NotificationBell from '@/components/NotificationBell';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeNav] = useState('settings');

  // Account State
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState<any>(null);
  
  // Notification State
  const [emailReminders, setEmailReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Appearance State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // UI State
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isPasswordUser, setIsPasswordUser] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      setDisplayName(user.displayName || '');
      
      setIsPasswordUser(user.providerData.some(p => p.providerId === 'password'));
      const loadSettings = async () => {
        try {
          const snap = await fetchResilient(doc(db, 'users', user.uid));
          if (snap && snap.exists()) {
            const data = snap.data();
            setProfile(data);
            if (data.settings) {
              setEmailReminders(data.settings.emailReminders ?? true);
              setWeeklyReport(data.settings.weeklyReport ?? true);
            }
          }
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      };
      loadSettings();

      // Load Theme from localStorage
      const savedTheme = localStorage.getItem('pathpilot_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, [user, loading, router]);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 5000);
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);

    try {
      // Update Display Name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        await updateDoc(doc(db, 'users', user.uid), { displayName });
      }

      // Update Password if provided
      if (newPassword) {
        if (!currentPassword) {
          showStatus('error', 'Current password is required to set a new one.');
          setIsUpdating(false);
          return;
        }
        
        // Re-authenticate
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setNewPassword('');
        setCurrentPassword('');
      }

      showStatus('success', 'Account settings updated successfully.');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Failed to update account.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Incorrect current password. Please verify and try again.';
      } else if (err.code === 'auth/requires-recent-login') {
        errMsg = 'Please log out and log back in to change your password.';
      }
      showStatus('error', errMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateNotifications = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        'settings.emailReminders': emailReminders,
        'settings.weeklyReport': weeklyReport
      });
      showStatus('success', 'Notification preferences saved.');
    } catch (e) {
      showStatus('error', 'Failed to save preferences.');
    }
  };

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pathpilot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pathpilot_theme', 'light');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== 'DELETE') return;
    setIsUpdating(true);

    try {
      // 1. Identity Verification
      const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
      
      if (isPasswordUser) {
        if (!deletePassword) {
          showStatus('error', 'Please enter your password to confirm identity.');
          setIsUpdating(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email!, deletePassword);
        await reauthenticateWithCredential(user, credential);
      } else if (isGoogleUser) {
        // Force Google re-authentication popup
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await reauthenticateWithPopup(user, provider);
      }

      // 2. Perform Account Deletion (Auth)
      await deleteUser(user);

      // 3. Clean up Firestore Data
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (firestoreErr) {
        console.warn("Auth deleted, but Firestore cleanup partial:", firestoreErr);
      }

      router.push('/auth');
    } catch (err: any) {
      console.error("Deletion Error:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showStatus('error', 'Verification failed: Incorrect password.');
      } else if (err.code === 'auth/requires-recent-login') {
        showStatus('error', 'Security block: Please log out and log back in to verify your identity before deleting.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        showStatus('error', 'Verification cancelled. Google login is required to delete this account.');
      } else {
        showStatus('error', `Deletion failed: ${err.message || 'Please contact support.'}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return null;

  const sidebarNavItems = [
    { id: 'home',     label: 'Home',     icon: <FiHome />,      action: () => router.push('/dashboard') },
    { id: 'progress', label: 'Progress', icon: <FiTrendingUp />, action: () => router.push('/progress') },
    ...(profile?.collegeCode || profile?.collegeId ? [{ id: 'materials', label: 'College Materials', icon: <FiBook />, action: () => router.push('/materials') }] : []),
    { id: 'profile',  label: 'Profile',  icon: <FiUser />,      action: () => router.push('/profile') },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward />, action: () => router.push('/leaderboard') },
    { id: 'settings', label: 'Settings', icon: <FiSettings />,  action: () => {} },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-cream)', color: 'var(--text-dark)', display: 'flex' }}>
      
      {/* ─── SIDEBAR ─── */}
      <aside className="clay-sidebar" style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 240,
        display: 'flex', flexDirection: 'column', zIndex: 100
      }}>
        <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 18,
            boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
          }}>P</div>
          <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>Path Pilot</span>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sidebarNavItems.map(item => (
            <button key={item.id} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, textAlign: 'left',
              transition: 'all 0.2s ease',
              background: activeNav === item.id ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
              color: activeNav === item.id ? '#fff' : 'var(--text-medium)',
              boxShadow: activeNav === item.id ? '0 4px 14px rgba(0,107,122,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, marginLeft: 240, padding: '48px 64px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          
          <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-dark)', letterSpacing: '-0.04em', marginBottom: 8 }}>Settings</h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Manage your account, appearance, and cockpit preferences.</p>
            </div>
            {user && <NotificationBell uid={user.uid} />}
          </header>

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  padding: '16px 20px', borderRadius: 16, marginBottom: 32,
                  display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: 14,
                  background: status.type === 'success' ? 'rgba(46,125,82,0.1)' : 'rgba(217,95,43,0.1)',
                  border: `1.5px solid ${status.type === 'success' ? 'rgba(46,125,82,0.3)' : 'rgba(217,95,43,0.3)'}`,
                  color: status.type === 'success' ? '#2E7D52' : '#D95F2B'
                }}
              >
                {status.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* ── Account Settings Section ── */}
            <section className="clay-card" style={{ padding: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--peacock-blue)' }}>
                  <FiUser />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-dark)' }}>Account Identity</h2>
              </div>

              <form onSubmit={handleUpdateAccount} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Display Name</label>
                    <div style={{ position: 'relative' }}>
                      <FiEdit2 style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="text" 
                        value={displayName} 
                        onChange={e => setDisplayName(e.target.value)}
                        className="sku-input"
                        style={{ paddingLeft: 42 }}
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="clay-divider" style={{ margin: '12px 0' }} />
                
                <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Change Password</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="sku-input"
                        style={{ paddingLeft: 42 }}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <FiShield style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)}
                        className="sku-input"
                        style={{ paddingLeft: 42 }}
                        placeholder="Min 6 characters"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
                  <button type="submit" disabled={isUpdating} className="btn-peacock-blue">
                    {isUpdating ? 'Saving...' : 'Update Account Profile'}
                  </button>
                </div>
              </form>
            </section>

            {/* ── Notification Preferences Section ── */}
            <section className="clay-card" style={{ padding: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--peacock-blue)' }}>
                    <FiBell />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-dark)' }}>Notification Matrix</h2>
                </div>
                <button onClick={handleUpdateNotifications} className="btn-ghost" style={{ padding: '8px 20px', borderRadius: 12, fontSize: 12 }}>
                  Save Matrix
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { id: 'reminders', label: 'Email Reminders', sub: 'Inactivity alerts and streak warnings', state: emailReminders, setter: setEmailReminders },
                  { id: 'report', label: 'Weekly Performance Report', sub: 'Digest of your progress and skill score change', state: weeklyReport, setter: setWeeklyReport }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-cream-light)', borderRadius: 16, border: '1.5px solid var(--border-clay)' }}>
                    <div>
                      <p style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: 14 }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{item.sub}</p>
                    </div>
                    <button 
                      onClick={() => item.setter(!item.state)}
                      style={{
                        width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                        padding: 3, position: 'relative', transition: 'all 0.3s ease',
                        background: item.state ? 'var(--peacock-blue)' : 'var(--border-clay)',
                      }}
                    >
                      <motion.div 
                        animate={{ x: item.state ? 22 : 0 }}
                        style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--surface-raised)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Appearance Section ── */}
            <section className="clay-card" style={{ padding: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--peacock-blue)' }}>
                  <FiMoon />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-dark)' }}>Appearance</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-cream-light)', borderRadius: 16, border: '1.5px solid var(--border-clay)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isDarkMode ? <FiMoon style={{ color: 'var(--peacock-blue)' }} /> : <FiSun style={{ color: 'var(--amber)' }} />}
                  <div>
                    <p style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: 14 }}>{isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Switch interface luminance</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  style={{
                    width: 56, height: 30, borderRadius: 15, border: 'none', cursor: 'pointer',
                    padding: 4, position: 'relative', transition: 'all 0.3s ease',
                    background: isDarkMode ? 'var(--peacock-blue)' : 'var(--bg-cream-deep)',
                  }}
                >
                  <motion.div 
                    animate={{ x: isDarkMode ? 26 : 0 }}
                    style={{ 
                      width: 22, height: 22, borderRadius: '50%', 
                      backgroundColor: 'var(--surface-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)' 
                    }}
                  >
                    {isDarkMode ? <FiMoon size={12} style={{ color: 'var(--peacock-blue)' }} /> : <FiSun size={12} style={{ color: 'var(--amber)' }} />}
                  </motion.div>
                </button>
              </div>
            </section>

            {/* ── Danger Zone Section ── */}
            <section style={{ 
              padding: 40, borderRadius: 28, background: 'rgba(217,95,43,0.04)', 
              border: '2px solid rgba(217,95,43,0.15)', marginTop: 16 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,95,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B04A1E' }}>
                  <FiAlertTriangle />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#B04A1E' }}>Danger Zone</h2>
              </div>
              <p style={{ color: '#8B6E52', fontSize: 13, marginBottom: 24, fontWeight: 500 }}>
                Actions here are permanent and cannot be undone. Please proceed with extreme caution.
              </p>
              
              <button onClick={() => setIsDeleteModalOpen(true)} className="btn-orange" style={{ background: 'linear-gradient(180deg, #F07A3E 0%, #D95F2B 50%, #B04A1E 100%)' }}>
                <FiTrash2 /> Terminate Account
              </button>
            </section>

          </div>
        </div>
      </main>

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,14,0.6)', backdropFilter: 'blur(10px)' }} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="clay-card"
              style={{ position: 'relative', width: '100%', maxWidth: 440, padding: 48, zIndex: 1, background: 'var(--surface-raised)' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(217,95,43,0.1)', color: '#D95F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24 }}>
                <FiTrash2 />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-dark)', marginBottom: 16, letterSpacing: '-0.02em' }}>Permanent Deletion</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                This will permanently delete your Path Pilot account, along with all labs, progress, and certificates. This action <strong>cannot be reversed</strong>.
              </p>
              
              <div style={{ backgroundColor: 'rgba(217,95,43,0.05)', padding: '20px', borderRadius: 16, marginBottom: 24, border: '1px solid rgba(217,95,43,0.1)' }}>
                {isPasswordUser ? (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#B04A1E', marginBottom: 8, textTransform: 'uppercase' }}>Confirm Password</p>
                    <input 
                      type="password" 
                      value={deletePassword} 
                      onChange={e => setDeletePassword(e.target.value)}
                      placeholder="Enter current password"
                      className="sku-input"
                      style={{ background: 'var(--surface-sunken)' }}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: 16, padding: '12px', background: 'rgba(180,140,90,0.1)', borderRadius: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#8B6E52', marginBottom: 4, textTransform: 'uppercase' }}>Security Verification</p>
                    <p style={{ fontSize: 12, color: '#5C3D1E', fontWeight: 500 }}>
                      This account is linked via Google. 
                      <strong style={{ color: '#006B7A', display: 'block', marginTop: 4 }}>
                        Identity verification via secure popup will be required to proceed.
                      </strong>
                    </p>
                  </div>
                )}
                
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#B04A1E', marginBottom: 8, textTransform: 'uppercase' }}>Type "DELETE" to confirm</p>
                  <input 
                    type="text" 
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="sku-input"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isUpdating}
                  className="btn-orange" 
                  style={{ flex: 1, opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5 }}
                >
                  {isUpdating ? 'DELETING...' : 'YES, DELETE ACCOUNT'}
                </button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-ghost" style={{ flex: 1 }}>
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .clay-sidebar { background: var(--bg-cream-deep) !important; color: var(--text-dark); }
        .dark .sku-input { background: var(--surface-sunken) !important; color: var(--text-dark); }
      `}</style>

    </div>
  );
}
