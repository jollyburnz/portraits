import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    function Home() {
      const [cardNumber, setCardNumber] = useState('');
      const navigate = useNavigate();

      const handleSearch = () => {
        if (cardNumber) {
          navigate(`/card/${cardNumber}`);
        }
      };

      return (
        <div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      );
    }

    export default Home;
