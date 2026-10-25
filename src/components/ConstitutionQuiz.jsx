import { useState, useRef } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function ConstitutionQuiz({ onBackToDashboard, onGoToExplorer, onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasRecordedCompletionRef = useRef(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  // Calculate actual score from userAnswers
  const correctAnswersCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercentage = totalQuestions > 0
    ? Math.round((correctAnswersCount / totalQuestions) * 100)
    : 0;

  // Handle selecting an option
  function handleSelectOption(index) {
    if (isAnswerSubmitted) return;

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    setSelectedAnswerIndex(index);
    setIsAnswerSubmitted(true);

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        articleNumber: currentQuestion.articleNumber,
        institution: currentQuestion.institution,
        selectedIndex: index,
        correctIndex: currentQuestion.correctAnswerIndex,
        selectedOptionText: currentQuestion.options[index],
        correctOptionText: currentQuestion.options[currentQuestion.correctAnswerIndex],
        explanation: currentQuestion.explanation,
        isCorrect,
      },
    ]);
  }

  // Move to next question or complete quiz
  function handleNext() {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      if (!hasRecordedCompletionRef.current) {
        hasRecordedCompletionRef.current = true;
        if (typeof onQuizComplete === 'function') {
          onQuizComplete({
            questionsAnswered: totalQuestions,
            correctAnswers: correctAnswersCount,
            scorePercentage,
          });
        }
      }
    }
  }

  // Reset all quiz state for a new attempt
  function handleTryAgain() {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
    hasRecordedCompletionRef.current = false;
  }

  // Dynamic feedback message based on score percentage
  function getScoreFeedback() {
    if (scorePercentage === 100) {
      return {
        badge: 'Perfect Score 🎯',
        headline: 'Outstanding Constitutional Scholar!',
        detail:
          'You answered all 6 questions correctly. You have an exceptional grasp of the fundamental provisions governing India’s Legislature, Executive, and Judiciary.',
        accent: 'green',
      };
    }
    if (scorePercentage >= 67) {
      return {
        badge: 'Great Effort 🌟',
        headline: 'Strong Constitutional Literacy!',
        detail:
          'You demonstrated a solid understanding of India’s constitutional structure. Review the few missed provisions to reach perfection.',
        accent: 'saffron',
      };
    }
    if (scorePercentage >= 50) {
      return {
        badge: 'Good Progress 📚',
        headline: 'Good Effort — Keep Exploring!',
        detail:
          'You understand the basics, but some key provisions need closer review. Use the Constitution Explorer to strengthen your understanding.',
        accent: 'navy',
      };
    }
    return {
      badge: 'Keep Learning 🌱',
      headline: 'A Great Opportunity to Learn!',
      detail:
        'Constitutional law takes practice. Revisit the Constitution Explorer to read the plain-language explanations and examples, then try again.',
      accent: 'navy',
    };
  }

  return (
    <div className="quiz">
      {/* Top navigation */}
      <nav className="quiz__nav" aria-label="Quiz navigation">
        <div className="quiz__nav-inner">
          <button
            type="button"
            className="quiz__back-btn"
            onClick={onBackToDashboard}
            aria-label="Return to Dashboard"
          >
            <span className="quiz__back-arrow" aria-hidden="true">←</span>
            <span>Back to Dashboard</span>
          </button>
          <div className="quiz__breadcrumb" aria-hidden="true">
            <span>Home</span>
            <span className="quiz__breadcrumb-sep">/</span>
            <span className="quiz__breadcrumb-current">Constitution Challenge</span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="quiz__header">
        <div className="quiz__header-inner">
          <div className="quiz__badge-pill">
            <span className="quiz__badge-dot" aria-hidden="true"></span>
            <span>Interactive Knowledge Challenge</span>
          </div>
          <h1 className="quiz__title">Constitution Challenge</h1>
          <p className="quiz__subtitle">
            Test your understanding of India's Constitution and its three pillars of democracy.
          </p>
        </div>
      </header>

      {/* Main Quiz Flow or Results Screen */}
      {!isCompleted ? (
        <section className="quiz__play-area" aria-label="Current Quiz Question">
          {/* Progress Header */}
          <div className="quiz__progress-card">
            <div className="quiz__progress-meta">
              <span className="quiz__question-counter">
                Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{totalQuestions}</strong>
              </span>
              <span className="quiz__progress-percentage">
                {Math.round(((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / totalQuestions) * 100)}% Complete
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div
              className="quiz__progress-bar-track"
              role="progressbar"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin="1"
              aria-valuemax={totalQuestions}
              aria-label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            >
              <div
                className="quiz__progress-bar-fill"
                style={{
                  width: `${((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <article className="quiz__card">
            {/* Question Badges */}
            <div className="quiz__card-header">
              <span className={`quiz__institution-tag quiz__institution-tag--${currentQuestion.institution.toLowerCase()}`}>
                {currentQuestion.institution}
              </span>
              <span className="quiz__article-badge">
                {currentQuestion.articleNumber}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="quiz__question-text">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div
              className="quiz__options-list"
              role="radiogroup"
              aria-label="Answer options"
            >
              {currentQuestion.options.map((option, idx) => {
                const label = OPTION_LABELS[idx];
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;

                let optionClass = 'quiz__option-btn';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionClass += ' quiz__option-btn--correct';
                  } else if (isSelected) {
                    optionClass += ' quiz__option-btn--incorrect';
                  } else {
                    optionClass += ' quiz__option-btn--dimmed';
                  }
                } else if (isSelected) {
                  optionClass += ' quiz__option-btn--selected';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={optionClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    aria-pressed={isSelected}
                    aria-label={`Option ${label}: ${option}`}
                  >
                    <span className="quiz__option-badge" aria-hidden="true">
                      {label}
                    </span>
                    <span className="quiz__option-text">
                      {option}
                    </span>
                    {isAnswerSubmitted && (
                      <span className="quiz__option-status" aria-hidden="true">
                        {isCorrect ? '✓' : isSelected ? '✕' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Box (appears upon submitting) */}
            {isAnswerSubmitted && (
              <div
                className={`quiz__feedback-panel ${
                  selectedAnswerIndex === currentQuestion.correctAnswerIndex
                    ? 'quiz__feedback-panel--correct'
                    : 'quiz__feedback-panel--incorrect'
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="quiz__feedback-header">
                  <span className="quiz__feedback-icon" aria-hidden="true">
                    {selectedAnswerIndex === currentQuestion.correctAnswerIndex ? '✓' : '✕'}
                  </span>
                  <div className="quiz__feedback-verdict">
                    <h3 className="quiz__feedback-title">
                      {selectedAnswerIndex === currentQuestion.correctAnswerIndex
                        ? 'Correct! Well done.'
                        : `Incorrect. The correct answer is Option ${OPTION_LABELS[currentQuestion.correctAnswerIndex]}.`}
                    </h3>
                  </div>
                </div>

                <div className="quiz__explanation-box">
                  <span className="quiz__explanation-label">
                    💡 Constitutional Context:
                  </span>
                  <p className="quiz__explanation-text">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <div className="quiz__next-wrap">
                  <button
                    type="button"
                    className="quiz__next-btn"
                    onClick={handleNext}
                    autoFocus
                  >
                    <span>
                      {currentQuestionIndex + 1 < totalQuestions ? 'Next Question' : 'View Quiz Results'}
                    </span>
                    <span className="quiz__next-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>
      ) : (
        /* Results Screen */
        <section className="quiz__results-area" aria-label="Quiz Results Summary">
          {(() => {
            const feedback = getScoreFeedback();
            return (
              <div className={`quiz__results-card quiz__results-card--${feedback.accent}`}>
                <div className="quiz__results-badge">
                  {feedback.badge}
                </div>

                <h2 className="quiz__results-headline">
                  {feedback.headline}
                </h2>

                <p className="quiz__results-detail">
                  {feedback.detail}
                </p>

                {/* Score Stats Display */}
                <div className="quiz__score-display">
                  <div className="quiz__score-box">
                    <span className="quiz__score-big">
                      {correctAnswersCount}
                      <span className="quiz__score-total"> / {totalQuestions}</span>
                    </span>
                    <span className="quiz__score-label">Questions Correct</span>
                  </div>

                  <div className="quiz__score-box quiz__score-box--percentage">
                    <span className="quiz__score-big">
                      {scorePercentage}%
                    </span>
                    <span className="quiz__score-label">Accuracy Score</span>
                  </div>
                </div>

                {/* Progress bar recap */}
                <div className="quiz__score-bar-wrap">
                  <div className="quiz__score-bar-track">
                    <div
                      className="quiz__score-bar-fill"
                      style={{ width: `${scorePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="quiz__results-actions">
                  <button
                    type="button"
                    className="quiz__btn quiz__btn--primary"
                    onClick={handleTryAgain}
                  >
                    <span aria-hidden="true">🔄</span>
                    <span>Try Again</span>
                  </button>

                  {onGoToExplorer && (
                    <button
                      type="button"
                      className="quiz__btn quiz__btn--secondary"
                      onClick={onGoToExplorer}
                    >
                      <span aria-hidden="true">📖</span>
                      <span>Explore Provisions</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="quiz__btn quiz__btn--outline"
                    onClick={onBackToDashboard}
                  >
                    <span>Back to Dashboard</span>
                  </button>
                </div>

                {/* Detailed Question Review */}
                <div className="quiz__review-section">
                  <h3 className="quiz__review-title">Question Breakdown</h3>
                  <div className="quiz__review-list">
                    {userAnswers.map((ans, idx) => (
                      <div
                        key={idx}
                        className={`quiz__review-item ${
                          ans.isCorrect ? 'quiz__review-item--correct' : 'quiz__review-item--incorrect'
                        }`}
                      >
                        <div className="quiz__review-status">
                          <span className="quiz__review-icon" aria-hidden="true">
                            {ans.isCorrect ? '✓' : '✕'}
                          </span>
                          <span className="quiz__review-number">Q{idx + 1}</span>
                        </div>
                        <div className="quiz__review-content">
                          <div className="quiz__review-meta">
                            <span className="quiz__review-article">{ans.articleNumber}</span>
                            <span className="quiz__review-institution">{ans.institution}</span>
                          </div>
                          <p className="quiz__review-qtext">{ans.question}</p>
                          <div className="quiz__review-answers">
                            <p className="quiz__review-user-ans">
                              <strong>Your answer:</strong> {ans.selectedOptionText}
                            </p>
                            {!ans.isCorrect && (
                              <p className="quiz__review-correct-ans">
                                <strong>Correct answer:</strong> {ans.correctOptionText}
                              </p>
                            )}
                          </div>
                          <p className="quiz__review-explanation">
                            <strong>Note:</strong> {ans.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}
    </div>
  );
}
