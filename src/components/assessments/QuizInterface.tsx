'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    time_limit?: number;
    passing_score: number;
    xp_reward: number;
}

interface Question {
    id: string;
    question_text: string;
    question_type: 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE';
    options: Option[];
    explanation?: string;
    points: number;
}

interface Option {
    text: string;
    is_correct: boolean;
}

const SAMPLE_QUIZ: Quiz = {
    id: '1',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    time_limit: 600, // 10 minutes
    passing_score: 70,
    xp_reward: 100,
    questions: [
        {
            id: '1',
            question_text: 'What is the output of: console.log(typeof null)?',
            question_type: 'MCQ',
            options: [
                { text: '"null"', is_correct: false },
                { text: '"object"', is_correct: true },
                { text: '"undefined"', is_correct: false },
                { text: '"number"', is_correct: false },
            ],
            explanation: 'typeof null returns "object" due to a historical bug in JavaScript that was never fixed.',
            points: 1,
        },
        {
            id: '2',
            question_text: 'Which of the following are valid JavaScript data types? (Select all that apply)',
            question_type: 'MULTIPLE_SELECT',
            options: [
                { text: 'String', is_correct: true },
                { text: 'Number', is_correct: true },
                { text: 'Boolean', is_correct: true },
                { text: 'Character', is_correct: false },
            ],
            explanation: 'JavaScript has String, Number, and Boolean as primitive types. There is no Character type.',
            points: 2,
        },
        {
            id: '3',
            question_text: 'Is JavaScript case-sensitive?',
            question_type: 'TRUE_FALSE',
            options: [
                { text: 'True', is_correct: true },
                { text: 'False', is_correct: false },
            ],
            explanation: 'JavaScript is case-sensitive. For example, "myVariable" and "myvariable" are different.',
            points: 1,
        },
    ],
};

export default function QuizInterface() {
    const [quiz] = useState<Quiz>(SAMPLE_QUIZ);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(quiz.time_limit || 0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    React.useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = () => {
        // Calculate score
        let totalPoints = 0;
        let earnedPoints = 0;

        quiz.questions.forEach((q) => {
            totalPoints += q.points;
            const userAnswer = answers[q.id];

            if (q.question_type === 'MCQ' || q.question_type === 'TRUE_FALSE') {
                const correctOption = q.options.find((opt) => opt.is_correct);
                if (userAnswer === correctOption?.text) {
                    earnedPoints += q.points;
                }
            } else if (q.question_type === 'MULTIPLE_SELECT') {
                const correctAnswers = q.options.filter((opt) => opt.is_correct).map((opt) => opt.text);
                const userAnswers = userAnswer || [];
                const isCorrect =
                    correctAnswers.length === userAnswers.length &&
                    correctAnswers.every((ans) => userAnswers.includes(ans));
                if (isCorrect) {
                    earnedPoints += q.points;
                }
            }
        });

        const percentage = Math.round((earnedPoints / totalPoints) * 100);
        setScore(percentage);
        setIsSubmitted(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isSubmitted) {
        const passed = score >= quiz.passing_score;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center"
                >
                    <div className="text-8xl mb-4">{passed ? '🎉' : '😕'}</div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        {passed ? 'Congratulations!' : 'Keep Trying!'}
                    </h2>
                    <p className="text-purple-300 mb-8">
                        You scored <span className="text-4xl font-bold text-white">{score}%</span>
                    </p>

                    {passed && (
                        <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                            <p className="text-green-200 font-bold">You earned {quiz.xp_reward} XP!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-purple-300 text-sm">Questions</p>
                            <p className="text-2xl font-bold text-white">{quiz.questions.length}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-purple-300 text-sm">Time Taken</p>
                            <p className="text-2xl font-bold text-white">
                                {formatTime((quiz.time_limit || 0) - timeLeft)}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-purple-300 text-sm">Passing Score</p>
                            <p className="text-2xl font-bold text-white">{quiz.passing_score}%</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                            Review Answers
                        </button>
                        {!passed && (
                            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30">
                                Retake Quiz
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                        <p className="text-purple-300">{quiz.description}</p>
                    </div>
                    {quiz.time_limit && (
                        <div className="text-center">
                            <p className="text-sm text-purple-300">Time Left</p>
                            <p className={`text-3xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                    {quiz.questions.map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-2 rounded-full ${index < currentQuestion
                                    ? 'bg-green-500'
                                    : index === currentQuestion
                                        ? 'bg-purple-500'
                                        : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question */}
            <div className="max-w-4xl mx-auto">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30"
                >
                    <div className="mb-6">
                        <span className="text-purple-300 text-sm font-semibold">
                            Question {currentQuestion + 1} of {quiz.questions.length}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-2">{question.question_text}</h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected =
                                question.question_type === 'MULTIPLE_SELECT'
                                    ? (answers[question.id] || []).includes(option.text)
                                    : answers[question.id] === option.text;

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (question.question_type === 'MULTIPLE_SELECT') {
                                            const current = answers[question.id] || [];
                                            const updated = current.includes(option.text)
                                                ? current.filter((ans: string) => ans !== option.text)
                                                : [...current, option.text];
                                            handleAnswerChange(question.id, updated);
                                        } else {
                                            handleAnswerChange(question.id, option.text);
                                        }
                                    }}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${isSelected
                                            ? 'bg-purple-600 text-white border-2 border-purple-400'
                                            : 'bg-white/5 text-white hover:bg-white/10 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-purple-300'
                                                }`}
                                        >
                                            {isSelected && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                                        </div>
                                        <span className="flex-1">{option.text}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-500 transition-all hover:shadow-lg hover:shadow-green-500/50"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
