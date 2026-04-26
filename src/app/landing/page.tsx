'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, FiCode, FiCpu, FiMessageSquare, 
  FiTrendingUp, FiCheckCircle, FiShield, FiZap
} from 'react-icons/fi';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { title: "AI Onboarding", desc: "Personalized roadmap calibrated to your current level", icon: <FiTrendingUp size={26} />, color: '#006B7A' },
    { title: "Built-in IDE", desc: "Code instantly — zero setup, zero friction", icon: <FiCode size={26} />, color: '#2E7D52' },
    { title: "AI Code Analyzer", desc: "Socratic hints that guide your thinking, not your code", icon: <FiCpu size={26} />, color: '#D95F2B' },
    { title: "Doubt Bot", desc: "Study-focused AI mentor, strictly on-topic", icon: <FiMessageSquare size={26} />, color: '#7A4B2A' },
    { title: "Skill Score", desc: "AI-verified mastery score visible to top companies", icon: <FiShield size={26} />, color: '#006B7A' },
    { title: "Get Hired", desc: "Direct connection to companies that trust our scores", icon: <FiCheckCircle size={26} />, color: '#2E7D52' },
  ];

  const steps = [
    { num: "01", title: "AI Calibration", desc: "Tell us your path. Our AI designs your curriculum.", color: '#006B7A' },
    { num: "02", title: "Learn & Build", desc: "Video lessons, labs, and real code challenges.", color: '#2E7D52' },
    { num: "03", title: "Earn Your Score", desc: "Complete labs and get an AI-verified skill score.", color: '#D95F2B' },
    { num: "04", title: "Get Hired", desc: "Companies find and hire you based on your verified score.", color: '#7A4B2A' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC' }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(253, 246, 236, 0.92)',
        borderBottom: '2px solid rgba(180,140,90,0.2)',
        backdropFilter: 'blur(12px)',
        padding: '0 48px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(140,90,40,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 18,
            boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
          }}>P</div>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E', letterSpacing: '-0.03em' }}>Path Pilot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/auth')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 14, color: '#5C3D1E',
            padding: '8px 16px', borderRadius: 10,
            transition: 'all 0.2s'
          }}>
            Sign In
          </button>
          <button onClick={() => router.push('/auth?role=company')} style={{
            background: 'none', border: '2px solid rgba(0,107,122,0.3)', cursor: 'pointer',
            fontWeight: 700, fontSize: 14, color: '#006B7A',
            padding: '8px 18px', borderRadius: 10,
            transition: 'all 0.2s'
          }}>
            For Companies
          </button>
          <button onClick={() => router.push('/auth')} className="btn-peacock-blue" style={{ padding: '10px 22px', fontSize: 13 }}>
            Get Started <FiArrowRight />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ padding: '100px 48px 80px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="clay-badge" style={{ margin: '0 auto 24px', width: 'fit-content' }}>
            <FiZap size={12} color="#D95F2B" />
            India's Smartest Dev Learning Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 76px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: '#2C1A0E',
            marginBottom: 24
          }}>
            Learn. Code.<br />
            <span className="text-gradient-peacock">Get Hired.</span>
          </h1>
          <p style={{
            fontSize: 18, fontWeight: 500, color: '#5C3D1E',
            maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7
          }}>
            Built for Tier 2 & 3 engineering students in India. AI-powered roadmaps, real coding labs, and verified skill scores that top companies trust.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth')} className="btn-peacock-blue" style={{ padding: '16px 36px', fontSize: 15 }}>
              Start Learning Free <FiArrowRight />
            </button>
            <button onClick={() => router.push('/auth?role=company')} className="btn-ghost" style={{ padding: '16px 36px', fontSize: 15 }}>
              For Companies →
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section style={{ padding: '60px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Engineered for Performance
          </h2>
          <p style={{ color: '#5C3D1E', fontSize: 16, fontWeight: 500 }}>
            Every feature is built around one goal: getting you hired.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="clay-card"
              style={{ padding: '32px 28px' }}
            >
              <div style={{
                width: 52, height: 52,
                background: `${f.color}15`,
                border: `2px solid ${f.color}30`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color,
                marginBottom: 18,
                boxShadow: `0 4px 12px ${f.color}20`
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#2C1A0E', marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ color: '#5C3D1E', fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(180deg, #F5EAD7 0%, #FDF6EC 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 12 }}>
              How It Works
            </h2>
            <p style={{ color: '#5C3D1E', fontSize: 16, fontWeight: 500 }}>From zero to hired in four focused steps.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="clay-card"
                style={{ padding: '32px 24px', textAlign: 'center' }}
              >
                <div style={{
                  fontSize: 40, fontWeight: 900,
                  color: s.color, letterSpacing: '-0.04em',
                  lineHeight: 1, marginBottom: 16,
                  fontFamily: 'monospace'
                }}>{s.num}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#2C1A0E', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#5C3D1E', fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <div className="clay-card" style={{ maxWidth: 640, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to start your journey?
          </h2>
          <p style={{ color: '#5C3D1E', fontSize: 16, marginBottom: 32, fontWeight: 500 }}>
            Join thousands of students already on Path Pilot.
          </p>
          <button onClick={() => router.push('/auth')} className="btn-peacock-blue" style={{ padding: '16px 48px', fontSize: 16 }}>
            Join Path Pilot Free <FiArrowRight />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '2px solid rgba(180,140,90,0.2)',
        padding: '32px 48px',
        textAlign: 'center',
        color: '#8B6E52',
        fontSize: 13,
        fontWeight: 500
      }}>
        © 2026 Path Pilot · Learn. Code. Get Hired.
      </footer>

    </div>
  );
}
