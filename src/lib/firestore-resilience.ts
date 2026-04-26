import { doc, getDoc, DocumentSnapshot, DocumentData, DocumentReference } from 'firebase/firestore';

/**
 * fetchResilient — A wrapper around getDoc with a built-in timeout race.
 * This prevents the app from hanging indefinitely if Firestore is offline
 * and allows for custom fallback logic.
 */
export async function fetchResilient(
    docRef: DocumentReference<DocumentData>,
    timeoutMs: number = 3000
): Promise<DocumentSnapshot<DocumentData> | null> {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
    const fetch = getDoc(docRef);

    try {
        const result = await Promise.race([fetch, timeout]);
        return result;
    } catch (err) {
        console.warn('Firestore fetchResilient: Error encountered (likely offline):', err);
        return null; // Return null so the calling code can use local state/cache fallback
    }
}
