import { useState, useEffect } from 'react';
import quotesdb from "../quotes.json";

const Quotes = () => {
  
  const quotes = quotesdb.quotes;
  
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
        setIsVisible(true);
      }, 500);
      
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div 
        className={`max-w-2xl text-center transition-all duration-500 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        <blockquote className="text-lg md:text-xl lg:text-2xl font-light text-gray-700 leading-relaxed mb-4">
          "{currentQuote}"
        </blockquote>
        <cite className="text-sm md:text-base text-gray-500 font-medium tracking-wide">
          — Ayanokoji Kiyotaka
        </cite>
      </div>
    </div>
  );
};

export default Quotes;