import { useState } from 'react';
import './App.css';
import { ConstitutionExplorer } from './components/ConstitutionExplorer';
import { ConstitutionQuiz } from './components/ConstitutionQuiz';
import { MyProgress } from './components/MyProgress';
import { loadProgress, recordCompletedQuizAttempt } from './utils/progressStorage';


function BookIcon() {
  return (
    <div className="icon icon--book" aria-hidden="true">
      <div className="icon__book-spine"></div>
      <div className="icon__book-page icon__book-page--1"></div>
      <div className="icon__book-page icon__book-page--2"></div>
      <div className="icon__book-page icon__book-page--3"></div>
    </div>
  );
}

function QuizIcon() {
  return (
    <div className="icon icon--quiz" aria-hidden="true">
      <div className="icon__quiz-board">
        <div className="icon__quiz-q">?</div>
        <div className="icon__quiz-options">
          <div className="icon__quiz-opt icon__quiz-opt--a"></div>
          <div className="icon__quiz-opt icon__quiz-opt--b"></div>
          <div className="icon__quiz-opt icon__quiz-opt--c"></div>
        </div>
      </div>
    </div>
  );
}

function ProgressIcon() {
  return (
    <div className="icon icon--progress" aria-hidden="true">
      <div className="icon__progress-ring">
        <div className="icon__progress-fill"></div>
      </div>
      <div className="icon__progress-check">✓</div>
    </div>
  );
}

/* ---- Pillar icons for quick facts ---- */

function PillarIcon({ type }) {
  const symbols = {
    legislature: '§',
    executive: '⚙',
    judiciary: '⚖',
  };
  return (
    <span className={`pillar__icon pillar__icon--${type}`} aria-hidden="true">
      {symbols[type]}
    </span>
  );
}

/* ---- CSS illustration: Preamble scroll ---- */

function PreambleIllustration() {
  return (
    <div className="illustration" aria-hidden="true">
      <div className="illustration__scroll">
        <div className="illustration__scroll-top"></div>
        <div className="illustration__scroll-body">
          <div className="illustration__line illustration__line--title"></div>
          <div className="illustration__line illustration__line--long"></div>
          <div className="illustration__line illustration__line--long"></div>
          <div className="illustration__line illustration__line--medium"></div>
          <div className="illustration__line illustration__line--long"></div>
          <div className="illustration__line illustration__line--short"></div>
        </div>
        <div className="illustration__scroll-bottom"></div>
      </div>
      <div className="illustration__emblem">
        <div className="illustration__chakra">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="illustration__spoke"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </div>
      </div>
      <div className="illustration__stars">
        <span className="illustration__star illustration__star--1"></span>
        <span className="illustration__star illustration__star--2"></span>
        <span className="illustration__star illustration__star--3"></span>
      </div>
    </div>
  );
}

/* ---- Learning card data ---- */

const learningCards = [
  {
    id: 'explorer',
    title: 'Constitution Explorer',
    description: 'Explore important constitutional provisions in simple language.',
    Icon: BookIcon,
    accent: 'saffron',
    buttonLabel: 'Start Exploring',
  },
  {
    id: 'quiz',
    title: 'Play & Learn',
    description: 'Test your knowledge with interactive constitutional quizzes.',
    Icon: QuizIcon,
    accent: 'green',
    buttonLabel: 'Take a Quiz',
  },
  {
    id: 'progress',
    title: 'My Progress',
    description: 'Track your learning journey and completed activities.',
    Icon: ProgressIcon,
    accent: 'navy',
    buttonLabel: 'View Progress',
  },
];

/* ---- Pillar data ---- */

const pillars = [
  {
    id: 'legislature',
    name: 'Legislature',
    description: 'Makes laws for the nation through Parliament and State Legislatures.',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Implements laws and administers government at all levels.',
  },
  {
    id: 'judiciary',
    name: 'Judiciary',
    description: 'Interprets laws and administers justice through the courts.',
  },
];



function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'explorer' | 'quiz' | 'progress'
  const [toastMessage, setToastMessage] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  function handleCardClick(card) {
    if (card.id === 'explorer') {
      setCurrentView('explorer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card.id === 'quiz') {
      setCurrentView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card.id === 'progress') {
      setCurrentView('progress');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setToastMessage(`${card.title} — Coming soon!`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  }

  function handleNavigateHome() {
    if (currentView !== 'dashboard') {
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleNavigateToExplorer() {
    setCurrentView('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavigateToQuiz() {
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRecordQuizComplete(attemptData) {
    const updated = recordCompletedQuizAttempt(attemptData);
    setProgress(updated);
  }

  return (
    <div className="app">
      {/* ===== Header ===== */}
      <header className="header" role="banner">
        <div className="header__inner">
          <div
            className={`header__brand ${currentView !== 'dashboard' ? 'header__brand--clickable' : ''}`}
            role={currentView !== 'dashboard' ? 'button' : undefined}
            tabIndex={currentView !== 'dashboard' ? 0 : undefined}
            onClick={handleNavigateHome}
            onKeyDown={(e) => {
              if (currentView !== 'dashboard' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleNavigateHome();
              }
            }}
            title={currentView !== 'dashboard' ? 'Return to Dashboard' : undefined}
          >
            <div className="header__emblem" aria-hidden="true">
              <span className="header__emblem-s">S</span>
              <span className="header__emblem-a">S</span>
            </div>
            <div className="header__text">
              <h1 className="header__title">Sansthaein Aur Samvidhan</h1>
              <p className="header__tagline">Discover the Constitution. Play. Learn. Participate.</p>
            </div>
          </div>
          <span className="header__label">Constitutional Literacy</span>
        </div>
        {/* Subtle tri-color accent line */}
        <div className="header__accent" aria-hidden="true">
          <div className="header__accent-band header__accent-band--saffron"></div>
          <div className="header__accent-band header__accent-band--white"></div>
          <div className="header__accent-band header__accent-band--green"></div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="main" role="main">
        {currentView === 'dashboard' && (
          <>
            {/* ---- Welcome section ---- */}
            <section className="welcome" aria-labelledby="welcome-heading">
              <div className="welcome__text">
                <h2 id="welcome-heading" className="welcome__heading">
                  Understand the Constitution.<br />
                  <span className="welcome__heading-accent">One step at a time.</span>
                </h2>
                <p className="welcome__description">
                  Explore the institutions that govern India — the Legislature, Executive, and
                  Judiciary. Learn about constitutional provisions through guided exploration
                  and test your knowledge with interactive activities.
                </p>
              </div>
              <PreambleIllustration />
            </section>

            {/* ---- Learning cards ---- */}
            <section className="cards" aria-labelledby="cards-heading">
              <h2 id="cards-heading" className="section-heading">Start Learning</h2>
              <div className="cards__grid">
                {learningCards.map((card) => (
                  <article
                    key={card.id}
                    className={`card card--${card.accent}`}
                    tabIndex="0"
                    role="button"
                    aria-label={`${card.title}: ${card.description}`}
                    onClick={() => handleCardClick(card)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(card);
                      }
                    }}
                  >
                    <div className="card__icon-wrap">
                      <card.Icon />
                    </div>
                    <h3 className="card__title">{card.title}</h3>
                    <p className="card__description">{card.description}</p>
                    <span className="card__button">{card.buttonLabel}</span>
                  </article>
                ))}
              </div>
            </section>

            {/* ---- Quick facts / pillars ---- */}
            <section className="pillars" aria-labelledby="pillars-heading">
              <h2 id="pillars-heading" className="section-heading">Three Pillars of Democracy</h2>
              <div className="pillars__grid">
                {pillars.map((p) => (
                  <div key={p.id} className={`pillar pillar--${p.id}`}>
                    <PillarIcon type={p.id} />
                    <h3 className="pillar__name">{p.name}</h3>
                    <p className="pillar__desc">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {currentView === 'explorer' && (
          <ConstitutionExplorer onBackToDashboard={handleNavigateHome} />
        )}

        {currentView === 'quiz' && (
          <ConstitutionQuiz
            onBackToDashboard={handleNavigateHome}
            onGoToExplorer={handleNavigateToExplorer}
            onQuizComplete={handleRecordQuizComplete}
          />
        )}

        {currentView === 'progress' && (
          <MyProgress
            progress={progress}
            onBackToDashboard={handleNavigateHome}
            onGoToQuiz={handleNavigateToQuiz}
            onGoToExplorer={handleNavigateToExplorer}
          />
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <p className="footer__text">Made to make constitutional learning simpler.</p>
        </div>
        <div className="footer__accent" aria-hidden="true">
          <div className="footer__accent-band footer__accent-band--saffron"></div>
          <div className="footer__accent-band footer__accent-band--white"></div>
          <div className="footer__accent-band footer__accent-band--green"></div>
        </div>
      </footer>

      {/* ===== Toast notification ===== */}
      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
