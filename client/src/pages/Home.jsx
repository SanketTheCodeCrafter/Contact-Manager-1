import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Contact Management <br />
          <span className="highlight">Reimagined</span>
        </h1>
        <p className="hero-description">
          The smartest way to organize, track, and manage your professional relationships.
          Secure, fast, and accessible from anywhere.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>

      <style>{`
        .home-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
            position: relative;
            z-index: 1;
        }
        .hero-content {
            max-width: 900px;
            padding: 2rem;
            animation: fadeIn 0.8s ease-out;
        }
        .hero-title {
            font-size: 4.5rem;
            margin-bottom: 2rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            line-height: 1.1;
        }
        .highlight {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            display: inline-block;
        }
        .highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            opacity: 0.3;
            filter: blur(8px);
            border-radius: 4px;
        }
        .hero-description {
            font-size: 1.5rem;
            color: var(--text-muted);
            margin-bottom: 3rem;
            line-height: 1.6;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            font-weight: 300;
        }
        .hero-actions {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .hero-title { font-size: 3rem; }
            .hero-description { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  )
}
