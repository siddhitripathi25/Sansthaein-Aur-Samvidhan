/**
 * Local Learning Progress Storage Utility
 * Safely persists user quiz attempts and learning statistics using web storage.
 * Gracefully handles missing, corrupted, or unavailable storage.
 */

const STORAGE_KEY = 'sansthaein_learning_progress_v1';

export const DEFAULT_PROGRESS = {
  quizAttempts: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  bestScorePercentage: null,
  latestScorePercentage: null,
  completedActivities: 0,
  lastCompletedAt: null,
};

/**
 * Validates and normalizes raw progress data.
 */
function normalizeProgress(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PROGRESS };
  }

  const quizAttempts = Number.isInteger(raw.quizAttempts) && raw.quizAttempts >= 0
    ? raw.quizAttempts
    : 0;
  const totalQuestionsAnswered = Number.isInteger(raw.totalQuestionsAnswered) && raw.totalQuestionsAnswered >= 0
    ? raw.totalQuestionsAnswered
    : 0;
  const totalCorrectAnswers = Number.isInteger(raw.totalCorrectAnswers) && raw.totalCorrectAnswers >= 0
    ? raw.totalCorrectAnswers
    : 0;
  const bestScorePercentage = typeof raw.bestScorePercentage === 'number' && raw.bestScorePercentage >= 0 && raw.bestScorePercentage <= 100
    ? raw.bestScorePercentage
    : null;
  const latestScorePercentage = typeof raw.latestScorePercentage === 'number' && raw.latestScorePercentage >= 0 && raw.latestScorePercentage <= 100
    ? raw.latestScorePercentage
    : null;
  const completedActivities = Number.isInteger(raw.completedActivities) && raw.completedActivities >= 0
    ? raw.completedActivities
    : quizAttempts;
  const lastCompletedAt = typeof raw.lastCompletedAt === 'string'
    ? raw.lastCompletedAt
    : null;

  return {
    quizAttempts,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    bestScorePercentage,
    latestScorePercentage,
    completedActivities,
    lastCompletedAt,
  };
}

/**
 * Loads saved progress from local storage.
 * Returns default zero-value progress if no data exists or if parsing fails.
 */
export function loadProgress() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_PROGRESS };
    }

    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      return { ...DEFAULT_PROGRESS };
    }

    const parsed = JSON.parse(item);
    return normalizeProgress(parsed);
  } catch (err) {
    console.warn('Could not load learning progress, falling back to defaults:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Saves a completed quiz attempt into local progress.
 * Only call this when an attempt is completely finished.
 *
 * @param {Object} params
 * @param {number} params.questionsAnswered - Number of questions answered in this attempt
 * @param {number} params.correctAnswers - Number of correct answers in this attempt
 * @param {number} params.scorePercentage - Percentage scored in this attempt
 * @returns {Object} Updated progress object
 */
export function recordCompletedQuizAttempt({ questionsAnswered, correctAnswers, scorePercentage }) {
  try {
    const current = loadProgress();

    const newAttempts = current.quizAttempts + 1;
    const newQuestions = current.totalQuestionsAnswered + (questionsAnswered || 0);
    const newCorrect = current.totalCorrectAnswers + (correctAnswers || 0);
    const validScore = Math.max(0, Math.min(100, Math.round(scorePercentage || 0)));

    const newBest = current.bestScorePercentage === null
      ? validScore
      : Math.max(current.bestScorePercentage, validScore);

    const updated = {
      quizAttempts: newAttempts,
      totalQuestionsAnswered: newQuestions,
      totalCorrectAnswers: newCorrect,
      bestScorePercentage: newBest,
      latestScorePercentage: validScore,
      completedActivities: current.completedActivities + 1,
      lastCompletedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  } catch (err) {
    console.error('Failed to record completed quiz attempt:', err);
    return loadProgress();
  }
}

/**
 * Resets local learning progress to zero defaults.
 */
export function resetLocalProgress() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Failed to reset learning progress:', err);
  }
  return { ...DEFAULT_PROGRESS };
}
