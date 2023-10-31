import React, { useState, useEffect } from 'react';

const Timer = ({ initialMinutes, onTimerEnd, titleState }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let countdownInterval;
    if(!isPaused){
        if (minutes >= 0 && seconds >= 0) {
        countdownInterval = setInterval(() => {
            if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(countdownInterval);
                onTimerEnd(); // Call the callback when the countdown is finished
            } else {
                setMinutes(minutes - 1);
                setSeconds(59);
            }
            } else {
            setSeconds(seconds - 1);
            }
        }, 1000);
        }
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [minutes, seconds, onTimerEnd, isPaused, titleState, initialMinutes]);

  const handlePauseClick = () => {
    setIsPaused(true);
  }

  const handleResumeClick = () => {
    setIsPaused(false);
  }

  
  useEffect(() => {
    // Update the initialMinutes when the titleState changes
    setMinutes(initialMinutes);
  }, [titleState, initialMinutes]);


  return (
    <div id='timer-container'>
      <h1 id='title'>{titleState}</h1>
      <div>
        <p id='time'>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        {!isPaused ? (<button className='btn-act' onClick={handlePauseClick}>Pause</button>) : (<button className='btn-act' onClick={handleResumeClick}>Resume</button>)}
      </div>
    </div>
  );
};

export default Timer;
