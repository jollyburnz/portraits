import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    let supabase;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.error('Please provide your Supabase URL and Anon Key in .env file');
    } else {
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    function CardDetail() {
      const { cardNumber } = useParams();
      const [card, setCard] = useState<any>(null);
      const [error, setError] = useState<string | null>(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchCard = async () => {
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
              navigate('/no-results');
            } else if (data) {
              setCard(data);
            } else {
              navigate('/no-results');
            }
          } catch (err: any) {
            setError('An unexpected error occurred: ' + err.message);
            navigate('/no-results');
          }
        };

        fetchCard();
      }, [cardNumber, navigate]);

      return (
        <div>
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

    export default CardDetail;
