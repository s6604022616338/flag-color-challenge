/**
 * Leaderboard & Timing utilities for Flag Color Challenge!
 * Stores and ranks the top 10 player records in localStorage.
 */

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number; // 0 - 100
  timeSeconds: number; // Elapsed time in seconds
  timestamp: number;
}

const STORAGE_KEY = 'flag_challenge_leaderboard';

/**
 * Format seconds into Thai text format (minutes and seconds)
 * e.g., 75 -> "1 นาที 15 วินาที", 45 -> "45 วินาที", 120 -> "2 นาที 0 วินาที"
 */
export function formatDurationThai(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  if (mins === 0) {
    return `${secs} วินาที`;
  }
  return `${mins} นาที ${secs} วินาที`;
}

/**
 * Format seconds into digital MM:SS format
 * e.g., 75 -> "01:15"
 */
export function formatDigitalTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');
  return `${minsStr}:${secsStr}`;
}

/**
 * Retrieve the current Top 10 leaderboard from localStorage
 */
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Sort: score desc, timeSeconds asc
    return parsed
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeSeconds - b.timeSeconds;
      })
      .slice(0, 10);
  } catch (err) {
    console.error('Failed to load leaderboard from localStorage:', err);
    return [];
  }
}

/**
 * Record a game result for a player.
 * If the same nickname already exists, only keep their single best result
 * (higher score, or same score with shorter time).
 * Keeps only the Top 10 entries.
 */
export function recordScore(
  playerName: string,
  score: number,
  timeSeconds: number
): { rank: number; isNewRecord: boolean; leaderboard: LeaderboardEntry[] } {
  const cleanName = playerName.trim();
  if (!cleanName) {
    return { rank: -1, isNewRecord: false, leaderboard: getLeaderboard() };
  }

  try {
    const currentList = getLeaderboard();
    const normalizedName = cleanName.toLowerCase();

    // Check if player name already exists
    const existingIndex = currentList.findIndex(
      (entry) => entry.playerName.trim().toLowerCase() === normalizedName
    );

    let isNewRecord = false;

    if (existingIndex >= 0) {
      const existing = currentList[existingIndex];
      // Compare: Is current performance better?
      // Better if higher score OR (equal score AND faster time)
      const isBetterScore = score > existing.score;
      const isSameScoreFaster = score === existing.score && timeSeconds < existing.timeSeconds;

      if (isBetterScore || isSameScoreFaster) {
        currentList[existingIndex] = {
          ...existing,
          playerName: cleanName, // preserve latest casing
          score,
          timeSeconds,
          timestamp: Date.now(),
        };
        isNewRecord = true;
      }
    } else {
      // New player
      currentList.push({
        id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        playerName: cleanName,
        score,
        timeSeconds,
        timestamp: Date.now(),
      });
      isNewRecord = true;
    }

    // Sort strictly: score (DESC), then timeSeconds (ASC)
    const sorted = currentList
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeSeconds - b.timeSeconds;
      })
      .slice(0, 10);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));

    // Find rank in the updated top 10 (1-based, or -1 if not in top 10)
    const rankIndex = sorted.findIndex(
      (entry) => entry.playerName.trim().toLowerCase() === normalizedName
    );
    const rank = rankIndex >= 0 ? rankIndex + 1 : -1;

    return { rank, isNewRecord, leaderboard: sorted };
  } catch (err) {
    console.error('Failed to save score to leaderboard:', err);
    return { rank: -1, isNewRecord: false, leaderboard: getLeaderboard() };
  }
}
