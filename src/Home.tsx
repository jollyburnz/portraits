import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function Home({ theme, toggleTheme }: HomeProps) {
  const [cardNumber, setCardNumber] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (cardNumber) {
      navigate(`/card/${cardNumber}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Portrait Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default Home;
