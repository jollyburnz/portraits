import React, { useState, useEffect, useRef } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { createClient } from '@supabase/supabase-js';
    import anime from 'animejs';

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
      const svgContainerRef = useRef<HTMLDivElement>(null);
      const animationRef = useRef<anime.AnimeInstance | null>(null);
      const cardFlipRef = useRef<HTMLDivElement>(null);
      const [isFlipped, setIsFlipped] = useState(false);

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

      useEffect(() => {
        if (card && card.svgPath && svgContainerRef.current) {
          const fetchSVG = async () => {
            try {
              const response = await fetch(card.svgPath);
              if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
              }
              const svgText = await response.text();
              if (svgContainerRef.current) {
                svgContainerRef.current.innerHTML = svgText;
                const paths = svgContainerRef.current.querySelectorAll('path');
                animationRef.current = anime({
                  targets: paths,
                  strokeDashoffset: [anime.setDashoffset, 0],
                  easing: 'easeInOutSine',
                  duration: 1500,
                  delay: anime.stagger(100),
                  loop: true,
                  direction: 'alternate',
                });
              }
            } catch (err) {
              console.error('Error fetching or animating SVG:', err);
            }
          };
          fetchSVG();
        }
        return () => {
          if (animationRef.current) {
            animationRef.current.pause();
            animationRef.current = null;
          }
        };
      }, [card]);

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

      const handleBack = () => {
        navigate('/');
      };

      const handleFlip = () => {
        setIsFlipped(!isFlipped);
      };

      return (
        <div>
          <button onClick={handleBack}>Back</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {card && (
            <div className="card-container">
              <h2>Card Number: {card.cardNumber}</h2>
              <div className={`card-flip-container ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip} ref={cardFlipRef}>
                <div className="card-face front">
                  <div ref={svgContainerRef}></div>
                </div>
                <div className="card-face back">
                  <div>
                    {card.photoPath && (
                      <img src={card.photoPath} alt="Card Photo" />
                    )}
                  </div>
                </div>
              </div>
              <button onClick={handleShare}>Share</button>
            </div>
          )}
        </div>
      );
    }

    export default CardDetail;
