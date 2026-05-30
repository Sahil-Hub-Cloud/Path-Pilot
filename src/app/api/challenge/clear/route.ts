export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/** DELETE all cached challenges under challenges/{courseId}/topics/{topicId} */
export async function DELETE(req: NextRequest) {
  const secret = req.headers.get('x-challenge-clear-secret');
  const expected = process.env.CHALLENGE_CLEAR_SECRET || process.env.CRON_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let deletedCourses = 0;
    let deletedTopics = 0;

    const coursesSnap = await adminDb.collection('challenges').get();
    for (const courseDoc of coursesSnap.docs) {
      const topicsSnap = await courseDoc.ref.collection('topics').get();
      if (topicsSnap.size > 0) {
        const batch = adminDb.batch();
        topicsSnap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        deletedTopics += topicsSnap.size;
      }
      await courseDoc.ref.delete();
      deletedCourses += 1;
    }

    console.log(`[/api/challenge/clear] Deleted ${deletedTopics} topic docs across ${deletedCourses} courses`);
    return NextResponse.json({
      ok: true,
      deletedCourses,
      deletedTopics,
      message: 'All challenge cache cleared. Regenerate by opening Challenge tabs.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Clear failed';
    console.error('[/api/challenge/clear]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
