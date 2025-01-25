import React, { useState } from 'react';
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    let supabase;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.error('Please provide your Supabase URL and Anon Key in .env file');
    } else {
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    function App() {
      const [cardNumber, setCardNumber] = useState('');
      const [card, setCard] = useState<any>(null);
      const [error, setError] = useState<string | null>(null);

      const handleSearch = async () => {
        setError(null);
        setCard(null);

        if (!supabase) {
          setError('Supabase client not initialized. Check console for details.');
          return;
        }

        try {
          const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('cardNumber', cardNumber)
            .single();

          if (error) {
            setError('Error fetching card: ' + error.message);
          } else if (data) {
            setCard(data);
          } else {
             setError('Card not found');
          }
        } catch (err: any) {
          setError('An unexpected error occurred: ' + err.message);
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {card && (
            <div className="card-container">
              <h2>Card Number: {card.cardNumber}</h2>
              {card.svgPath && (
                <div style={{width: '100px', height: '100px'}}>
                  <img src={card.svgPath} alt="Card SVG" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </div>
              )}
              {card.photoPath && (
                <div style={{width: '100px', height: '100px'}}>
                  <img src={card.photoPath} alt="Card Photo" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    export default App;
