/**
 * MyProgress Component
 * Displays local learning progress, quiz attempts, question statistics,
 * best & latest scores, and a dedicated empty state for new learners.
 */

export function MyProgress({
  progress,
  onBackToDashboard,
  onGoToQuiz,
  onGoToExplorer,
}) {
  const hasActivity = progress && progress.quizAttempts > 0;

  // Calculate overall historical accuracy
  const overallAccuracy =
    hasActivity && progress.totalQuestionsAnswered > 0
      ? Math.round(
          (progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100
        )
      : 0;

  return (
    <div className="progress-screen">
      {/* Top navigation */}
      <nav className="progress-screen__nav" aria-label="Progress navigation">
        <div className="progress-screen__nav-inner">
          <button
            type="button"
            className="progress-screen__back-btn"
            onClick={onBackToDashboard}
            aria-label="Return to Dashboard"
          >
            <span className="progress-screen__back-arrow" aria-hidden="true">←</span>
            <span>Back to Dashboard</span>
          </button>
          <div className="progress-screen__breadcrumb" aria-hidden="true">
            <span>Home</span>
            <span className="progress-screen__breadcrumb-sep">/</span>
            <span className="progress-screen__breadcrumb-current">My Progress</span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="progress-screen__header">
        <div className="progress-screen__header-inner">
          <div className="progress-screen__badge-pill">
            <span className="progress-screen__badge-dot" aria-hidden="true"></span>
            <span>Local Learning Records</span>
          </div>
          <h1 className="progress-screen__title">My Learning Progress</h1>
          <p className="progress-screen__subtitle">
            Track your constitutional literacy journey, quiz attempts, and performance across sessions.
          </p>
        </div>
      </header>

      {/* Main Content: Stats or Empty State */}
      {hasActivity ? (
        <section className="progress-screen__content" aria-label="Learning Statistics">
          {/* Primary Stats Grid */}
          <div className="progress-screen__grid">
            {/* Card 1: Quiz Attempts */}
            <article className="stat-card stat-card--navy">
              <div className="stat-card__icon-wrap" aria-hidden="true">
                🎯
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Quiz Attempts Completed</span>
                <span className="stat-card__value">{progress.quizAttempts}</span>
                <span className="stat-card__hint">
                  {progress.completedActivities} completed learning {progress.completedActivities === 1 ? 'activity' : 'activities'}
                </span>
              </div>
            </article>

            {/* Card 2: Questions Answered & Correct */}
            <article className="stat-card stat-card--green">
              <div className="stat-card__icon-wrap" aria-hidden="true">
                ✓
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Correct Answers</span>
                <span className="stat-card__value">
                  {progress.totalCorrectAnswers}
                  <span className="stat-card__subvalue"> / {progress.totalQuestionsAnswered}</span>
                </span>
                <span className="stat-card__hint">
                  Overall historical accuracy: <strong>{overallAccuracy}%</strong>
                </span>
              </div>
            </article>

            {/* Card 3: Best Score */}
            <article className="stat-card stat-card--saffron">
              <div className="stat-card__icon-wrap" aria-hidden="true">
                🏆
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Best Quiz Score</span>
                <span className="stat-card__value">
                  {progress.bestScorePercentage !== null ? `${progress.bestScorePercentage}%` : '—'}
                </span>
                <span className="stat-card__hint">Highest achieved in an attempt</span>
              </div>
            </article>

            {/* Card 4: Latest Score */}
            <article className="stat-card stat-card--blue">
              <div className="stat-card__icon-wrap" aria-hidden="true">
                ⏱️
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Most Recent Score</span>
                <span className="stat-card__value">
                  {progress.latestScorePercentage !== null ? `${progress.latestScorePercentage}%` : '—'}
                </span>
                <span className="stat-card__hint">From your latest completed quiz</span>
              </div>
            </article>
          </div>

          {/* Visual Progress Bar Section */}
          <div className="progress-screen__accuracy-card">
            <div className="progress-screen__accuracy-header">
              <div className="progress-screen__accuracy-title-wrap">
                <h2 className="progress-screen__accuracy-title">Cumulative Accuracy</h2>
                <p className="progress-screen__accuracy-desc">
                  Based on all {progress.totalQuestionsAnswered} questions answered across {progress.quizAttempts} {progress.quizAttempts === 1 ? 'attempt' : 'attempts'}.
                </p>
              </div>
              <span className="progress-screen__accuracy-badge">
                {overallAccuracy}% Overall
              </span>
            </div>

            <div
              className="progress-screen__bar-track"
              role="progressbar"
              aria-valuenow={overallAccuracy}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Cumulative accuracy rate"
            >
              <div
                className="progress-screen__bar-fill"
                style={{ width: `${overallAccuracy}%` }}
              ></div>
            </div>
          </div>

          {/* Action Row */}
          <div className="progress-screen__actions">
            {onGoToQuiz && (
              <button
                type="button"
                className="progress-screen__btn progress-screen__btn--primary"
                onClick={onGoToQuiz}
              >
                <span>Take a Quiz</span>
                <span aria-hidden="true">→</span>
              </button>
            )}

            {onGoToExplorer && (
              <button
                type="button"
                className="progress-screen__btn progress-screen__btn--secondary"
                onClick={onGoToExplorer}
              >
                <span>Explore Provisions</span>
                <span aria-hidden="true">📖</span>
              </button>
            )}

            <button
              type="button"
              className="progress-screen__btn progress-screen__btn--outline"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      ) : (
        /* Empty State for New Learner */
        <section className="progress-screen__empty" aria-label="No learning progress yet">
          <div className="progress-screen__empty-icon" aria-hidden="true">
            🌱
          </div>
          <h2 className="progress-screen__empty-title">
            No learning activity recorded yet
          </h2>
          <p className="progress-screen__empty-message">
            Welcome to Sansthaein Aur Samvidhan! As you complete quizzes and engage with constitutional provisions, your progress, scores, and accuracy will be tracked here.
          </p>

          <div className="progress-screen__empty-stats-preview" aria-hidden="true">
            <div className="progress-screen__preview-pill">0 Quiz Attempts</div>
            <div className="progress-screen__preview-pill">0 Questions Answered</div>
            <div className="progress-screen__preview-pill">— Best Score</div>
          </div>

          <div className="progress-screen__empty-actions">
            {onGoToQuiz && (
              <button
                type="button"
                className="progress-screen__btn progress-screen__btn--primary"
                onClick={onGoToQuiz}
              >
                <span>Take Your First Quiz</span>
                <span aria-hidden="true">→</span>
              </button>
            )}

            {onGoToExplorer && (
              <button
                type="button"
                className="progress-screen__btn progress-screen__btn--secondary"
                onClick={onGoToExplorer}
              >
                <span>Explore Provisions First</span>
              </button>
            )}

            <button
              type="button"
              className="progress-screen__btn progress-screen__btn--outline"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
