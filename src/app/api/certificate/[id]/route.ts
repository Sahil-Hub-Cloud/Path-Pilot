export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// IMPORTANT: This line must be present in ALL API routes to prevent Vercel build failures

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Dynamically import Firebase to prevent Vercel build crash
    const { db, auth } = await import("@/lib/firebase");
    const { doc, getDoc } = await import("firebase/firestore");
    const { signInAnonymously } = await import("firebase/auth");

    if (!db) {
      return NextResponse.json({ error: "Database temporarily unavailable" }, { status: 503 });
    }

    // Authenticate anonymously so the Firestore rule `allow read: if request.auth != null` passes
    await signInAnonymously(auth);

    const resolvedParams = await params;
    const certRef = doc(db, "certificates", resolvedParams.id);
    const snap = await getDoc(certRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const data = snap.data();
    const certificate = {
      id: data.certId,
      studentName: data.studentName,
      course: data.courseName,
      track: data.trackName,
      date: new Date(data.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      score: data.employabilityScore,
      userId: data.userId
    };

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Verification system error" }, { status: 500 });
  }
}
