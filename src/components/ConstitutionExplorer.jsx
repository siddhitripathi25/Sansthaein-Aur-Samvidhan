import { useState, useMemo } from 'react';
import { PROVISIONS_DATA } from '../data/provisions';

const INSTITUTIONS = [
  { id: 'all', label: 'All Institutions' },
  { id: 'Legislature', label: 'Legislature' },
  { id: 'Executive', label: 'Executive' },
  { id: 'Judiciary', label: 'Judiciary' },
];

export function ConstitutionExplorer({ onBackToDashboard }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter and search provisions
  const filteredProvisions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return PROVISIONS_DATA.filter((item) => {
      // 1. Institution filter match
      const matchesInstitution =
        selectedFilter === 'all' || item.institution === selectedFilter;
      if (!matchesInstitution) return false;

      // 2. Search query match (article number, title, explanation, or keywords)
      if (!query) return true;

      const matchesArticle =
        item.articleNumber.toLowerCase().includes(query) ||
        String(item.articleNum).includes(query);
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesExplanation = item.explanation.toLowerCase().includes(query);
      const matchesKeywords = item.keywords.some((kw) =>
        kw.toLowerCase().includes(query)
      );

      return matchesArticle || matchesTitle || matchesExplanation || matchesKeywords;
    });
  }, [searchQuery, selectedFilter]);

  // Handle clearing both search and filter
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('all');
  };

  return (
    <div className="explorer">
      {/* Top navigation bar */}
      <nav className="explorer__nav" aria-label="Explorer navigation">
        <div className="explorer__nav-inner">
          <button
            type="button"
            className="explorer__back-btn"
            onClick={onBackToDashboard}
            aria-label="Return to Dashboard"
          >
            <span className="explorer__back-arrow" aria-hidden="true">←</span>
            <span>Back to Dashboard</span>
          </button>
          <div className="explorer__breadcrumb" aria-hidden="true">
            <span>Home</span>
            <span className="explorer__breadcrumb-sep">/</span>
            <span className="explorer__breadcrumb-current">Constitution Explorer</span>
          </div>
        </div>
      </nav>

      {/* Hero header */}
      <header className="explorer__header">
        <div className="explorer__header-inner">
          <div className="explorer__badge-pill">
            <span className="explorer__badge-dot" aria-hidden="true"></span>
            <span>Curated Constitutional Provisions</span>
          </div>
          <h1 className="explorer__title">Constitution Explorer</h1>
          <p className="explorer__subtitle">
            Understand India's Constitution in simple language.
          </p>
        </div>
      </header>

      {/* Search and Filter Controls */}
      <section className="explorer__controls-section" aria-label="Search and filter provisions">
        <div className="explorer__controls">
          {/* Search Bar */}
          <div className="explorer__search-wrapper" role="search">
            <label htmlFor="provision-search" className="sr-only">
              Search constitutional provisions
            </label>
            <span className="explorer__search-icon" aria-hidden="true">🔍</span>
            <input
              id="provision-search"
              type="search"
              className="explorer__search-input"
              placeholder="Search by article (e.g. 79, 124), title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="search-count-desc"
            />
            {searchQuery && (
              <button
                type="button"
                className="explorer__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Institution Filter Pills */}
          <div className="explorer__filter-group" role="group" aria-label="Filter by institution">
            {INSTITUTIONS.map((inst) => {
              const isActive = selectedFilter === inst.id;
              const institutionClass =
                inst.id !== 'all' ? `explorer__filter-btn--${inst.id.toLowerCase()}` : '';
              return (
                <button
                  key={inst.id}
                  type="button"
                  className={`explorer__filter-btn ${institutionClass} ${
                    isActive ? 'explorer__filter-btn--active' : ''
                  }`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedFilter(inst.id)}
                >
                  {inst.label}
                  {inst.id !== 'all' && (
                    <span className="explorer__filter-count" aria-hidden="true">
                      {PROVISIONS_DATA.filter((p) => p.institution === inst.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="explorer__status-bar">
          <p id="search-count-desc" className="explorer__status-text">
            Showing <strong>{filteredProvisions.length}</strong> of{' '}
            <strong>{PROVISIONS_DATA.length}</strong> provisions
            {selectedFilter !== 'all' && (
              <span> in <strong>{selectedFilter}</strong></span>
            )}
            {searchQuery && (
              <span> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            )}
          </p>

          {(searchQuery || selectedFilter !== 'all') && (
            <button
              type="button"
              className="explorer__reset-link"
              onClick={handleResetFilters}
            >
              Reset all filters
            </button>
          )}
        </div>
      </section>

      {/* Main Results / Provision Cards */}
      <section className="explorer__content" aria-label="Constitutional provisions list">
        {filteredProvisions.length > 0 ? (
          <div className="explorer__grid">
            {filteredProvisions.map((provision) => {
              const institutionLower = provision.institution.toLowerCase();
              return (
                <article
                  key={provision.id}
                  className={`provision-card provision-card--${institutionLower}`}
                  aria-labelledby={`title-${provision.id}`}
                >
                  {/* Card Header */}
                  <div className="provision-card__header">
                    <div className="provision-card__meta">
                      <span className={`provision-card__tag provision-card__tag--${institutionLower}`}>
                        {provision.institution}
                      </span>
                      <span className="provision-card__part">
                        {provision.part}
                      </span>
                    </div>
                    <div className="provision-card__article-badge">
                      {provision.articleNumber}
                    </div>
                  </div>

                  {/* Provision Official Title */}
                  <h2 id={`title-${provision.id}`} className="provision-card__title">
                    {provision.title}
                  </h2>

                  {/* Plain Language Explanation */}
                  <div className="provision-card__section">
                    <h3 className="provision-card__label">
                      <span className="provision-card__label-icon" aria-hidden="true">📖</span>
                      Plain-Language Explanation
                    </h3>
                    <p className="provision-card__text">
                      {provision.explanation}
                    </p>
                  </div>

                  {/* Illustrative Example */}
                  <div className="provision-card__section provision-card__section--example">
                    <h3 className="provision-card__label provision-card__label--example">
                      <span className="provision-card__label-icon" aria-hidden="true">💡</span>
                      Illustrative Example
                    </h3>
                    <p className="provision-card__text provision-card__text--example">
                      {provision.example}
                    </p>
                  </div>

                  {/* Source and Reference Link */}
                  <div className="provision-card__footer">
                    <div className="provision-card__source-box">
                      <span className="provision-card__source-label">Authoritative Source:</span>
                      <a
                        href={provision.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="provision-card__source-link"
                        title="View official text from the Legislative Department (Govt. of India)"
                      >
                        <span>{provision.source.name}</span>
                        <span className="provision-card__link-arrow" aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State when no results match */
          <div className="explorer__empty" role="region" aria-live="polite">
            <div className="explorer__empty-icon" aria-hidden="true">📜</div>
            <h2 className="explorer__empty-title">No provisions found</h2>
            <p className="explorer__empty-message">
              No constitutional articles matched your search query{' '}
              {searchQuery && <strong>&ldquo;{searchQuery}&rdquo;</strong>}
              {selectedFilter !== 'all' && ` with filter “${selectedFilter}”`}.
            </p>
            <p className="explorer__empty-hint">
              Try searching by article number (e.g., 53, 79, 124), titles (e.g. Parliament, Supreme Court), or clear your filters to view all provisions.
            </p>
            <button
              type="button"
              className="explorer__empty-btn"
              onClick={handleResetFilters}
            >
              Clear Search & Show All Provisions
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
