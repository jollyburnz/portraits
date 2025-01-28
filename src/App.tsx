import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Home from './Home';
    import CardDetail from './CardDetail';
    import NoResults from './NoResults';

    function App() {
      const [theme, setTheme] = useState<'light' | 'dark'>('light');

      useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
      }, [theme]);

      const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      };

      return (
        <Router>
          <button className="theme-switch" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card/:cardNumber" element={<CardDetail />} />
            <Route path="/no-results" element={<NoResults />} />
          </Routes>
        </Router>
      );
    }

    export default App;
