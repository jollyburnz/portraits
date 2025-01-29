import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import CardDetail from './CardDetail';
import NoResults from './NoResults';
import './index.css';
import Div100vh from 'react-div-100vh';

interface AppProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface CardNumberContextType {
  cardNumber: string | undefined;
  setCardNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const CardNumberContext = createContext<CardNumberContextType | undefined>(undefined);

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cardNumber, setCardNumber] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Div100vh className="app-container">
      <Router>
        <CardNumberContext.Provider value={{ cardNumber, setCardNumber }}>
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
        </CardNumberContext.Provider>
      </Router>
    </Div100vh>
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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && location.pathname !== '/') {
      handleBack();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [location]);

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
  const { cardNumber: contextCardNumber } = useContext(CardNumberContext) || {};

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Portrait #${contextCardNumber}`,
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
      <p>&copy; 2024-2025</p>
      {showShareButton && (
        <button className="share-button" onClick={handleShare}>
          Share
        </button>
      )}
    </div>
  );
}

export default App;
