// TOP OF FILE - NO IMPORTS THAT INITIALIZE FIREBASE
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

// Lazy initialization - only runs when request comes in
let db: any = null;

async function getDb() {
  if (db) return db;
  
  const admin = await import('firebase-admin');
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  }
  
  db = admin.firestore();
  return db;
}

/**
 * HOD Skill Report API
 * 
 * Returns aggregated class-wide skill data for college administrators.
 * This is the B2B data visibility layer — what colleges pay for.
 */
export async function GET() {
    try {
        const database = await getDb();
        const { SkillMetricsService } = await import('@/lib/services/skill-metrics');
        const report = await SkillMetricsService.getClassReport();

        return NextResponse.json({
            success: true,
            report: {
                totalStudents: report.totalStudents,
                averages: report.averages,
                atRiskCount: report.atRisk.length,
                atRiskStudents: report.atRisk.map(s => ({
                    user_id: s.user_id,
                    logic: s.logic_reasoning_score,
                    debugging: s.debugging_score,
                    syntax_js: s.javascript_syntax_score,
                    syntax_py: s.python_syntax_score,
                    prompt: s.prompt_quality_score,
                    total_runs: s.total_runs,
                })),
                generatedAt: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('Skill Report Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate skill report' },
            { status: 500 }
        );
    }
}

