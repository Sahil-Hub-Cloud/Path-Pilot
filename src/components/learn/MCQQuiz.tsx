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

function getFallbackMCQs(topicName: string, courseName: string): MCQ[] {
  return [
    {
      question: `What is the main objective of ${topicName} in ${courseName}?`,
      options: [
        `To structure problem-solving and core logic for ${topicName}`,
        `To disable system security and validations`,
        `To bypass data processing steps completely`,
        `To clear browser memory cache automatically`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `Which of the following best describes a key concept in ${topicName}?`,
      options: [
        `It provides modular, reusable patterns for building solutions`,
        `It only works on offline servers without network access`,
        `It replaces all programming languages with machine code`,
        `It forces all variables to be read-only constants`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `When implementing ${topicName}, what is a recommended best practice?`,
      options: [
        `Ensure clear structure, separation of concerns, and error handling`,
        `Ignore edge cases and avoid writing documentation`,
        `Hardcode all configuration values directly in production`,
        `Use infinite loops to process inputs continuously`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `What primary benefit does mastering ${topicName} provide?`,
      options: [
        `Enhanced efficiency, scalability, and domain understanding`,
        `Guaranteed zero execution time across all systems`,
        `Automatic deletion of unused files on disk`,
        `Direct hardware acceleration without CPU interaction`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `In real-world applications, how is ${topicName} typically utilized?`,
      options: [
        `As a standard component within system workflows and architecture`,
        `Exclusively for styling user interface colors`,
        `Only during emergency system maintenance procedures`,
        `To encrypt all network packets using legacy algorithms`
      ],
      correctAnswerIndex: 0
    }
  ];
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
    setLoading(true);
    setError('');

    try {
      let mcqBank: MCQ[] = [];

      // 1. Try Firestore if user is logged in
      if (user) {
        try {
          const topicRef = doc(db, 'topics', topicId);
          console.log(`[MCQQuiz] Attempting to access Firestore path: topics/${topicId}`);
          const docSnap = await getDoc(topicRef);
          if (docSnap.exists() && docSnap.data()?.mcq_bank?.length) {
            mcqBank = docSnap.data().mcq_bank;
          }
        } catch (e) {
          console.warn('[MCQQuiz] Firestore fetch failed or skipped, trying API generation:', e);
        }
      }

      // 2. Try API generation if Firestore didn't have questions
      if (!mcqBank || mcqBank.length === 0) {
        try {
          console.log('[MCQQuiz] Requesting API MCQ generation...');
          const token = user ? await user.getIdToken() : '';
          const res = await fetch('/api/generate-mcqs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ topicName, courseName, topicId })
          });

          const data = await res.json();
          if (data.mcqs && Array.isArray(data.mcqs) && data.mcqs.length > 0) {
            mcqBank = data.mcqs;
          }
        } catch (e) {
          console.warn('[MCQQuiz] API generation failed, using dynamic fallbacks:', e);
        }
      }

      // 3. Fallback generator if both Firestore and API fail
      if (!mcqBank || mcqBank.length === 0) {
        mcqBank = getFallbackMCQs(topicName, courseName);
      }

      const selected = shuffleMCQs(mcqBank, Math.min(5, mcqBank.length));
      setQuizQuestions(selected);
    } catch (err: any) {
      console.error('[MCQQuiz] Error loading MCQs, using fallbacks:', err);
      const fallback = shuffleMCQs(getFallbackMCQs(topicName, courseName), 5);
      setQuizQuestions(fallback);
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
