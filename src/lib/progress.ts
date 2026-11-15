import { useState } from 'react';
import type { ActivityKind } from '../content/types';

export interface Attempt {
  correct: number;
  total: number;
  percent: number;
}
interface Progress {
  bookmarks: string[];
  attempts: Record<string, Partial<Record<ActivityKind, Attempt>>>;
}
const storageKey = 'retdemsetgo-progress-v1';
const blank = (): Progress => ({ bookmarks: [], attempts: {} });

function read(): Progress {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!stored || typeof stored !== 'object') return blank();
    const data = stored as Progress;
    if (
      !Array.isArray(data.bookmarks) ||
      !data.bookmarks.every((x) => typeof x === 'string') ||
      !data.attempts ||
      typeof data.attempts !== 'object' ||
      Array.isArray(data.attempts)
    )
      return blank();
    const attempts: Progress['attempts'] = {};
    for (const [key, record] of Object.entries(data.attempts)) {
      if (!record || typeof record !== 'object') continue;
      for (const kind of ['sequence', 'errors', 'quiz'] as const) {
        const a = record[kind];
        if (
          a &&
          Number.isInteger(a.correct) &&
          Number.isInteger(a.total) &&
          a.total > 0 &&
          a.correct >= 0 &&
          a.correct <= a.total &&
          a.percent === Math.round((a.correct / a.total) * 100)
        ) {
          attempts[key] = { ...attempts[key], [kind]: a };
        }
      }
    }
    return { bookmarks: data.bookmarks, attempts };
  } catch {
    return blank();
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(read);
  const [storageAvailable, setStorageAvailable] = useState(true);
  function update(next: Progress) {
    setProgress(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageAvailable(false);
    }
  }
  return {
    progress,
    storageAvailable,
    toggleBookmark(id: string) {
      update({
        ...progress,
        bookmarks: progress.bookmarks.includes(id)
          ? progress.bookmarks.filter((x) => x !== id)
          : [...progress.bookmarks, id],
      });
    },
    saveAttempt(key: string, kind: ActivityKind, attempt: Attempt) {
      update({
        ...progress,
        attempts: { ...progress.attempts, [key]: { ...progress.attempts[key], [kind]: attempt } },
      });
    },
    clear() {
      update(blank());
    },
  };
}
export type ProgressState = ReturnType<typeof useProgress>;
