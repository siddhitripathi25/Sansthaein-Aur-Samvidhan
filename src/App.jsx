import './App.css';

function App() {
  return (
    <div className="app">
      <div className="hero">
        {/* Decorative background elements */}
        <div className="bg-glow bg-glow--1" aria-hidden="true"></div>
        <div className="bg-glow bg-glow--2" aria-hidden="true"></div>
        <div className="bg-glow bg-glow--3" aria-hidden="true"></div>

        <div className="hero__content">
          {/* Ashoka Chakra inspired decorative element */}
          <div className="chakra" aria-hidden="true">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="chakra__spoke"
                style={{ transform: `rotate(${i * 15}deg)` }}
              />
            ))}
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--saffron">Sansthaein</span>
            <span className="hero__title-line hero__title-line--amp">&amp;</span>
            <span className="hero__title-line hero__title-line--green">Samvidhan</span>
          </h1>

          <p className="hero__subtitle">
            Discover the Constitution. Play. Learn. Participate.
          </p>

          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Desktop application setup complete
          </div>
        </div>

        {/* Decorative tri-color bar at the bottom */}
        <div className="tricolor" aria-hidden="true">
          <div className="tricolor__band tricolor__band--saffron"></div>
          <div className="tricolor__band tricolor__band--white"></div>
          <div className="tricolor__band tricolor__band--green"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
