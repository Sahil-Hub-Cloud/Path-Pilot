'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ForumTopic {
    id: string;
    title: string;
    content: string;
    author: string;
    created_at: string;
    upvotes: number;
    replies: number;
    tags: string[];
    is_pinned: boolean;
}

const SAMPLE_TOPICS: ForumTopic[] = [
    {
        id: '1',
        title: 'How to debug asynchronous JavaScript code?',
        content: 'I am having trouble understanding async/await and promises...',
        author: 'DevNewbie',
        created_at: '2 hours ago',
        upvotes: 15,
        replies: 8,
        tags: ['JavaScript', 'Async'],
        is_pinned: true,
    },
    {
        id: '2',
        title: 'Best practices for React component structure',
        content: 'What is the recommended folder structure for a large React app?',
        author: 'ReactLearner',
        created_at: '5 hours ago',
        upvotes: 23,
        replies: 12,
        tags: ['React', 'Best Practices'],
        is_pinned: false,
    },
    {
        id: '3',
        title: 'Machine Learning project ideas for beginners',
        content: 'Looking for project ideas to practice ML concepts',
        author: 'MLEnthusiast',
        created_at: '1 day ago',
        upvotes: 45,
        replies: 20,
        tags: ['Machine Learning', 'Projects'],
        is_pinned: false,
    },
];

export default function DiscussionForum() {
    const [topics, setTopics] = useState<ForumTopic[]>(SAMPLE_TOPICS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

    const filteredTopics = topics.filter((topic) => {
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || topic.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const allTags = Array.from(new Set(topics.flatMap((t) => t.tags)));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">💬 Community Forum</h1>
                <p className="text-purple-300">Ask questions, share knowledge, and help others learn</p>
            </div>

            {/* Search & Filter */}
            <div className="max-w-6xl mx-auto mb-8 bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="md:col-span-2 px-4 py-2 bg-white dark:bg-gray-800/10 text-white placeholder-purple-300 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 bg-white dark:bg-gray-800/10 text-white border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="unanswered">Unanswered</option>
                    </select>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-purple-300 text-sm self-center">Tags:</span>
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedTag ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800/10 text-purple-300 hover:bg-white dark:bg-gray-800/20'
                            }`}
                    >
                        All
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-800/10 text-purple-300 hover:bg-white dark:bg-gray-800/20'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* New Topic Button */}
            <div className="max-w-6xl mx-auto mb-6">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all hover:shadow-lg hover:shadow-purple-500/50">
                    ➕ Start New Discussion
                </button>
            </div>

            {/* Topics List */}
            <div className="max-w-6xl mx-auto space-y-4">
                {filteredTopics.map((topic, index) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white dark:bg-gray-800/15 transition-all cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            {/* Vote Section */}
                            <div className="flex flex-col items-center gap-1">
                                <button className="text-purple-300 hover:text-purple-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <span className="text-white font-bold">{topic.upvotes}</span>
                                <button className="text-purple-300 hover:text-purple-200">
                                    <svg className="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                {/* Title */}
                                <div className="flex items-center gap-2 mb-2">
                                    {topic.is_pinned && <span className="text-xl">📌</span>}
                                    <h3 className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                                        {topic.title}
                                    </h3>
                                </div>

                                {/* Excerpt */}
                                <p className="text-purple-200 text-sm mb-3 line-clamp-2">{topic.content}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {topic.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-white dark:bg-gray-800/10 rounded text-xs text-purple-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-purple-300">
                                    <span>👤 {topic.author}</span>
                                    <span>🕐 {topic.created_at}</span>
                                    <span>💬 {topic.replies} replies</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredTopics.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No topics found</h3>
                        <p className="text-purple-300">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
