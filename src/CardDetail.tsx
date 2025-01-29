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

interface CardDetailProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function CardDetail({ theme, toggleTheme }: CardDetailProps) {
  const { cardNumber } = useParams();
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const cardFlipRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 150, height: 150 });

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = Math.min(window.innerWidth * 0.9, 600);
      const size = Math.min(maxWidth, 300);
      setCardSize({ width: size, height: size });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            paths.forEach(path => {
              path.style.stroke = theme === 'dark' ? '#1DA1F2' : 'black';
            });
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
  }, [card, theme]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {card && (
        <div className="card-container">
          <div
            className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
            ref={cardFlipRef}
            style={{ width: cardSize.width, height: cardSize.height }}
          >
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
        </div>
      )}
    </div>
  );
}

export default CardDetail;
