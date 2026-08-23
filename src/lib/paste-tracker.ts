export interface PasteEvent {
  timestamp: number;
  charCount: number;
  xpDeducted: number;
  file: string;
}

export interface PasteTracker {
  events: PasteEvent[];
  totalPasteCount: number;
  totalXPDeducted: number;
  lastPasteTime: number;
}

const XP_PER_PASTE = 2;
const SMALL_PASTE_THRESHOLD = 50;
const SUSPICIOUS_PASTE_THRESHOLD = 500;
const COOLDOWN_MS = 2000;

export function createPasteTracker(): PasteTracker {
  return {
    events: [],
    totalPasteCount: 0,
    totalXPDeducted: 0,
    lastPasteTime: 0,
  };
}

export function trackPaste(
  tracker: PasteTracker,
  charCount: number,
  fileName: string
): { tracker: PasteTracker; xpDeducted: number; isSuspicious: boolean; message: string } {
  const now = Date.now();
  const timeSinceLastPaste = now - tracker.lastPasteTime;

  if (charCount < SMALL_PASTE_THRESHOLD) {
    return {
      tracker,
      xpDeducted: 0,
      isSuspicious: false,
      message: '',
    };
  }

  if (timeSinceLastPaste < COOLDOWN_MS) {
    return {
      tracker,
      xpDeducted: 0,
      isSuspicious: true,
      message: 'Slow down! Paste cooldown active.',
    };
  }

  let xpDeducted = XP_PER_PASTE;
  let isSuspicious = charCount > SUSPICIOUS_PASTE_THRESHOLD;

  if (isSuspicious) {
    xpDeducted = XP_PER_PASTE * 3;
  }

  const event: PasteEvent = {
    timestamp: now,
    charCount,
    xpDeducted,
    file: fileName,
  };

  const updatedTracker: PasteTracker = {
    events: [...tracker.events, event],
    totalPasteCount: tracker.totalPasteCount + 1,
    totalXPDeducted: tracker.totalXPDeducted + xpDeducted,
    lastPasteTime: now,
  };

  const message = isSuspicious
    ? `⚠️ Large paste detected (${charCount} chars). −${xpDeducted} XP`
    : `📋 Paste detected (${charCount} chars). −${xpDeducted} XP`;

  return { tracker: updatedTracker, xpDeducted, isSuspicious, message };
}

export function getPasteStats(tracker: PasteTracker): {
  totalPastes: number;
  totalXPLost: number;
  recentPastes: PasteEvent[];
  riskLevel: 'low' | 'medium' | 'high';
} {
  const recentWindow = 5 * 60 * 1000;
  const recentPastes = tracker.events.filter(e => Date.now() - e.timestamp < recentWindow);

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (tracker.totalPasteCount > 10 || recentPastes.length > 5) {
    riskLevel = 'high';
  } else if (tracker.totalPasteCount > 5 || recentPastes.length > 2) {
    riskLevel = 'medium';
  }

  return {
    totalPastes: tracker.totalPasteCount,
    totalXPLost: tracker.totalXPDeducted,
    recentPastes,
    riskLevel,
  };
}

export function shouldBlockSubmission(tracker: PasteTracker): { blocked: boolean; reason: string } {
  if (tracker.totalPasteCount > 15) {
    return {
      blocked: true,
      reason: 'Too many paste events detected. Please write your code manually to demonstrate your skills.',
    };
  }

  const last5Pastes = tracker.events.slice(-5);
  if (last5Pastes.length >= 5) {
    const allLarge = last5Pastes.every(e => e.charCount > SUSPICIOUS_PASTE_THRESHOLD);
    if (allLarge) {
      return {
        blocked: true,
        reason: 'Multiple large paste events detected. Path Pilot requires original work.',
      };
    }
  }

  return { blocked: false, reason: '' };
}
