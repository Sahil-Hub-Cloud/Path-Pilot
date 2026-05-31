'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface TheoryMCQProps {
  topicName: string;
  courseName: string;
  onPass: () => void;
  token?: string;
}

export function TheoryMCQ({ topicName, courseName, onPass, token }: TheoryMCQProps) {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateMCQs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mcq/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ topicName, courseName })
      });
      const data = await res.json();
      if (data.mcqs) {
        setMcqs(data.mcqs);
      } else {
        setError('Failed to generate MCQs.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    let s = 0;
    mcqs.forEach((mcq, idx) => {
      if (answers[idx] === mcq.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
    if (s >= 3) {
      setTimeout(() => {
        onPass();
      }, 2000);
    }
  };

  if (mcqs.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', border: '2px dashed rgba(180,140,90,0.3)', borderRadius: 12 }}>
        <p style={{ color: '#8B6E52', fontWeight: 600, marginBottom: 16 }}>Ready to test your knowledge?</p>
        <button
          onClick={generateMCQs}
          disabled={loading}
          style={{
            padding: '12px 24px', background: '#0D8C7A', color: '#fff', borderRadius: 8,
            fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate 5 MCQs'}
        </button>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  if (submitted) {
    const passed = score >= 3;
    return (
      <div style={{ padding: 32, textAlign: 'center', background: passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{passed ? '🎉' : '😕'}</div>
        <h3 style={{ color: passed ? '#16A34A' : '#DC2626', marginBottom: 8 }}>
          {passed ? 'Passed!' : 'Keep Trying!'}
        </h3>
        <p style={{ color: '#2C1A0E', fontWeight: 600 }}>Score: {score} / 5</p>
        {!passed && (
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); generateMCQs(); }}
            style={{ marginTop: 16, padding: '8px 16px', background: '#DC2626', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            Retake Test
          </button>
        )}
        {passed && (
          <p style={{ color: '#16A34A', marginTop: 12, fontSize: 14 }}>Marking as complete...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {mcqs.map((mcq, i) => (
        <div key={i} style={{ padding: 20, border: '1px solid rgba(180,140,90,0.2)', borderRadius: 12, background: '#FDF6EC' }}>
          <p style={{ fontWeight: 700, color: '#2C1A0E', marginBottom: 12 }}>{i + 1}. {mcq.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mcq.options.map((opt, j) => (
              <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`mcq-${i}`}
                  checked={answers[i] === opt}
                  onChange={() => setAnswers({ ...answers, [i]: opt })}
                />
                <span style={{ fontSize: 14, color: '#5C3D1E' }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < 5}
        style={{
          padding: '14px 24px', background: '#0D8C7A', color: '#fff', borderRadius: 8,
          fontWeight: 800, border: 'none', cursor: Object.keys(answers).length < 5 ? 'not-allowed' : 'pointer',
          opacity: Object.keys(answers).length < 5 ? 0.5 : 1
        }}
      >
        Submit Answers
      </button>
    </div>
  );
}
