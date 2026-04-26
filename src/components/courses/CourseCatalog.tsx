'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllRoadmaps } from '@/lib/data/roadmaps';
import type { Course, CourseFilters } from '@/lib/types/complete-types';

interface Props {
    onCourseSelect: (course: Course) => void;
}

// Convert roadmaps to course format
function getRealCourses(): Course[] {
    const roadmaps = getAllRoadmaps();
    return roadmaps.map((roadmap, index) => ({
        id: roadmap.id,
        domain_id: String(index + 1),
        title: roadmap.title,
        slug: roadmap.id,
        description: roadmap.description,
        thumbnail_url: '', // No fake thumbnails
        difficulty: roadmap.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        estimated_hours: roadmap.chapters.reduce((sum, ch) => sum + ch.estimatedHours, 0),
        instructor_name: 'Path Pilot', // Real platform name, not fake person
        rating: undefined, // No fake ratings
        enrollment_count: 0, // Real count, starts at 0
        is_published: true,
        tags: roadmap.skills.slice(0, 4), // Use real skills as tags
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));
}

export default function CourseCatalog({ onCourseSelect }: Props) {
    const [courses, setCourses] = useState<Course[]>(getRealCourses());
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(getRealCourses());
    const [filters, setFilters] = useState<CourseFilters>({
        difficulty: [],
        search: '',
        sort_by: 'popularity',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = [...courses];

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(search) ||
                    course.description?.toLowerCase().includes(search) ||
                    course.tags?.some((tag) => tag.toLowerCase().includes(search))
            );
        }

        // Difficulty filter
        if (filters.difficulty && filters.difficulty.length > 0) {
            filtered = filtered.filter((course) =>
                filters.difficulty!.includes(course.difficulty)
            );
        }

        // Sorting
        switch (filters.sort_by) {
            case 'popularity':
                filtered.sort((a, b) => b.enrollment_count - a.enrollment_count);
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'recent':
                filtered.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        setFilteredCourses(filtered);
    };

    const toggleDifficultyFilter = (difficulty: string) => {
        setFilters((prev) => {
            const current = prev.difficulty || [];
            const updated = current.includes(difficulty)
                ? current.filter((d) => d !== difficulty)
                : [...current, difficulty];
            return { ...prev, difficulty: updated };
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'BEGINNER':
                return 'bg-green-500';
            case 'INTERMEDIATE':
                return 'bg-yellow-500';
            case 'ADVANCED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Available Courses 📚</h1>
                <p className="text-purple-300">
                    Choose a learning path to start your journey!
                </p>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-purple-300 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Sort */}
                    <div>
                        <select
                            value={filters.sort_by}
                            onChange={(e) =>
                                setFilters({ ...filters, sort_by: e.target.value as any })
                            }
                            className="w-full px-4 py-2 bg-white/10 text-white border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="popularity">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="recent">Most Recent</option>
                            <option value="alphabetical">A-Z</option>
                        </select>
                    </div>

                    {/* View Mode */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 py-2 rounded-lg ${viewMode === 'grid'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-purple-300'
                                }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 py-2 rounded-lg ${viewMode === 'list'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-purple-300'
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {/* Difficulty Filters */}
                <div className="flex gap-2 mt-4">
                    <span className="text-purple-300 text-sm self-center">Difficulty:</span>
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((diff) => (
                        <button
                            key={diff}
                            onClick={() => toggleDifficultyFilter(diff)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filters.difficulty?.includes(diff)
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid/List */}
            <div className="max-w-7xl mx-auto">
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }
                >
                    {filteredCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all cursor-pointer group"
                            onClick={() => onCourseSelect(course)}
                        >
                            {/* Thumbnail */}
                            <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl">
                                {course.domain_id === '1'
                                    ? '🌐'
                                    : course.domain_id === '2'
                                        ? '📊'
                                        : course.domain_id === '3'
                                            ? '📱'
                                            : course.domain_id === '4'
                                                ? '⚙️'
                                                : course.domain_id === '5'
                                                    ? '🤖'
                                                    : '🔒'}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Difficulty Badge */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getDifficultyColor(
                                            course.difficulty
                                        )}`}
                                    >
                                        {course.difficulty}
                                    </span>
                                    <span className="text-xs text-purple-300">
                                        {course.estimated_hours}+ hours
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                {/* Instructor */}
                                <p className="text-xs text-purple-300 mb-3">
                                    By {course.instructor_name}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags?.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-white/10 rounded text-xs text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-purple-300">
                                        📚 {course.estimated_hours} hours of learning
                                    </div>
                                </div>

                                {/* Enroll Button */}
                                <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50">
                                    Start Learning →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
                        <p className="text-purple-300">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
