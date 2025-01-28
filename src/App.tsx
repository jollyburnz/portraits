import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Home from './Home';
    import CardDetail from './CardDetail';
    import NoResults from './NoResults';

    function App() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card/:cardNumber" element={<CardDetail />} />
            <Route path="/no-results" element={<NoResults />} />
          </Routes>
        </Router>
      );
    }

    export default App;
