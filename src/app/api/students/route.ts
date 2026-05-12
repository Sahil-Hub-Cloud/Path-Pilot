export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Assuming server-side firebase admin is setup or using client-side lite if allowed, but for API routes we need admin usually.
// In a real Next.js app, we'd use firebase-admin. For this spec, I will implement robust functional mocks or direct firestore if configured.

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    
    // Mock talent pool based on AI scores
    const students = [
      { id: "1", name: "Arjun Mehta", score: 94, skill: "Frontend", labs: 22, level: "Elite" },
      { id: "2", name: "Sneha Patel", score: 88, skill: "Backend", labs: 18, level: "Advanced" },
      { id: "3", name: "Rahul Sharma", score: 81, skill: "AI/ML", labs: 15, level: "Intermediate" },
      { id: "4", name: "Priya Singh", score: 91, skill: "Fullstack", labs: 25, level: "Elite" },
    ];

    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch talent pool" }, { status: 500 });
  }
}

