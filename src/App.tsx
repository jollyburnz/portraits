import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
    import Home from './Home';
    import CardDetail from './CardDetail';
    import NoResults from './NoResults';
    import './index.css';

    function App() {
      const [theme, setTheme] = useState<'light' | 'dark'>('light');

      useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
      }, [theme]);

      const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      };

      return (
        <div className="app-container">
          <Router>
            <header className="app-header">
              <HeaderContent theme={theme} toggleTheme={toggleTheme} />
            </header>
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
                <Route path="/card/:cardNumber" element={<CardDetail theme={theme} toggleTheme={toggleTheme} />} />
                <Route path="/no-results" element={<NoResults />} />
              </Routes>
            </main>
            <footer className="app-footer">
              <FooterContent />
            </footer>
          </Router>
        </div>
      );
    }

    interface HeaderContentProps {
      theme: 'light' | 'dark';
      toggleTheme: () => void;
    }

    function HeaderContent({ theme, toggleTheme }: HeaderContentProps) {
      const location = useLocation();
      const navigate = useNavigate();

      const handleBack = () => {
        navigate('/');
      };

      const showBackButton = location.pathname !== '/';

      return (
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {showBackButton && (
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
            )}
          </div>
          <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
        </div>
      );
    }

    interface ThemeSwitchProps {
      theme: 'light' | 'dark';
      toggleTheme: () => void;
    }

    function ThemeSwitch({ theme, toggleTheme }: ThemeSwitchProps) {
      return (
        <button className="theme-switch" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      );
    }

    function FooterContent() {
      const location = useLocation();
      const navigate = useNavigate();
      const { cardNumber } = useParams();

      const handleShare = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Portrait ${cardNumber}`,
              url: window.location.href,
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert('URL copied to clipboard!');
          } catch (err) {
            console.error('Failed to copy URL: ', err);
            alert('Failed to copy URL to clipboard');
          }
        }
      };

      const showShareButton = location.pathname.startsWith('/card/');

      return (
        <div className="footer-content">
          <p>&copy; 2024</p>
          {showShareButton && (
            <button className="share-button" onClick={handleShare}>
              Share
            </button>
          )}
        </div>
      );
    }

    export default App;
