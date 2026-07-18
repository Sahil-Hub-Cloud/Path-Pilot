'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface MCQ {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface MCQQuizProps {
  topicId: string;
  topicName: string;
  courseName: string;
  onPass: () => void;
}

function shuffleMCQs(mcqs: MCQ[], count: number): MCQ[] {
  // Randomly select 'count' questions
  const selected = [...mcqs].sort(() => Math.random() - 0.5).slice(0, count);

  // Shuffle options for each selected question
  return selected.map(mcq => {
    const originalOptions = [...mcq.options];
    const correctOptionText = originalOptions[mcq.correctAnswerIndex];

    const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctOptionText);

    return {
      ...mcq,
      options: shuffledOptions,
      correctAnswerIndex: newCorrectIndex,
    };
  });
}

export function MCQQuiz({ topicId, topicName, courseName, onPass }: MCQQuizProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchOrGenerateMCQs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      // Try to fetch from Firestore
      const topicRef = doc(db, 'topics', topicId);
      const docSnap = await getDoc(topicRef);
      let mcqBank: MCQ[] = [];

      if (docSnap.exists() && docSnap.data().mcq_bank) {
        mcqBank = docSnap.data().mcq_bank;
      } else {
        // Generate via API
        const token = await user.getIdToken();
        const res = await fetch('/api/generate-mcqs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ topicName, courseName, topicId })
        });
        
        const data = await res.json();
        if (data.mcqs) {
          mcqBank = data.mcqs;
        } else {
          throw new Error(data.error || 'Failed to generate MCQs');
        }
      }

      // Randomly select 5 and shuffle
      if (mcqBank.length > 0) {
        const selected = shuffleMCQs(mcqBank, 5);
        setQuizQuestions(selected);
      } else {
        throw new Error('No MCQs returned');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching MCQs.');
    } finally {
      setLoading(false);
    }
  }, [user, topicId, topicName, courseName]);

  useEffect(() => {
    fetchOrGenerateMCQs();
  }, [fetchOrGenerateMCQs]);

  const handleSubmit = () => {
    let s = 0;
    quizQuestions.forEach((mcq, idx) => {
      if (answers[idx] === mcq.correctAnswerIndex) s++;
    });
    setScore(s);
    setSubmitted(true);
    // Mastery: Must get all 5 correct
    if (s === 5) {
      setTimeout(() => {
        onPass();
      }, 1500);
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(0);
    // Reshuffle and fetch new 5 questions to ensure mastery
    fetchOrGenerateMCQs();
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: '#0D8C7A', fontWeight: 600 }}>Loading Mastery Quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#DC2626' }}>
        <p>{error}</p>
        <button
          onClick={fetchOrGenerateMCQs}
          style={{ marginTop: 12, padding: '8px 16px', background: '#0D8C7A', color: '#fff', borderRadius: 8 }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (submitted) {
    const passed = score === 5;
    return (
      <div style={{ padding: 32, textAlign: 'center', background: passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{passed ? '🏆' : '💪'}</div>
        <h3 style={{ color: passed ? '#16A34A' : '#DC2626', marginBottom: 8, fontSize: 24, fontWeight: 800 }}>
          {passed ? 'Mastery Achieved!' : 'Keep Practicing!'}
        </h3>
        <p style={{ color: '#2C1A0E', fontWeight: 600, fontSize: 16 }}>Score: {score} / 5</p>
        <p style={{ color: '#8B6E52', fontSize: 14, marginTop: 8 }}>
          {passed ? 'You have demonstrated mastery of this topic.' : 'You must score 5/5 to pass this topic.'}
        </p>
        {!passed && (
          <button
            onClick={handleRetake}
            style={{ marginTop: 24, padding: '12px 24px', background: '#DC2626', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Retake Quiz
          </button>
        )}
        {passed && (
          <p style={{ color: '#16A34A', marginTop: 16, fontSize: 14, fontWeight: 600 }}>Marking MCQ as complete...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FFF8EE', padding: '16px', borderRadius: '12px', border: '1px solid rgba(180,140,90,0.2)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#2C1A0E', margin: '0 0 4px 0' }}>Mastery Check</h3>
        <p style={{ fontSize: 13, color: '#8B6E52', margin: 0 }}>Answer all 5 questions correctly to unlock the next topic.</p>
      </div>
      
      {quizQuestions.map((mcq, i) => (
        <div key={i} style={{ padding: 20, border: '1px solid rgba(180,140,90,0.2)', borderRadius: 12, background: '#FDF6EC' }}>
          <p style={{ fontWeight: 700, color: '#2C1A0E', marginBottom: 16, fontSize: 15 }}>{i + 1}. {mcq.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mcq.options.map((opt, j) => (
              <label key={j} style={{ 
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                padding: '12px 16px', background: answers[i] === j ? 'rgba(13,140,122,0.1)' : '#fff',
                border: answers[i] === j ? '1.5px solid #0D8C7A' : '1.5px solid rgba(180,140,90,0.15)',
                borderRadius: '8px', transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name={`mcq-${i}`}
                  checked={answers[i] === j}
                  onChange={() => setAnswers({ ...answers, [i]: j })}
                  style={{ accentColor: '#0D8C7A', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: 14, color: '#5C3D1E', fontWeight: answers[i] === j ? 600 : 400 }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < 5}
        style={{
          padding: '16px 24px', background: '#0D8C7A', color: '#fff', borderRadius: 12,
          fontWeight: 800, fontSize: 16, border: 'none', cursor: Object.keys(answers).length < 5 ? 'not-allowed' : 'pointer',
          opacity: Object.keys(answers).length < 5 ? 0.5 : 1, transition: 'opacity 0.2s'
        }}
      >
        Submit Answers
      </button>
    </div>
  );
}
