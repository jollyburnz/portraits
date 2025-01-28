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

          if (!cardNumber) {
            setError('Card number is missing in the URL.');
            navigate('/no-results');
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

      const handleShare = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Card ${cardNumber}`,
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
              <button onClick={handleShare}>Share</button>
            </div>
          )}
        </div>
      );
    }

    export default CardDetail;
