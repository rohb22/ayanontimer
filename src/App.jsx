import React, { useState } from 'react';
import './App.css';
import Timer from './components/Timer';

function showNotification() {
  if(document.visibilityState === "visible") {
      return;
  }
  var title = "Time's Up";
  var body = "On to the next sequence";
  var notification = new Notification(title, { body });
  notification.onclick = () => { 
         notification.close();
         window.parent.focus();
  }
}

function App() {
  Notification.requestPermission();
  const [initialMinutes, setInitialMinutes] = useState(30); // Initial countdown minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [eventTitle, setEventTitle] = useState("Study");
  const [isStarted, setIsStarted] = useState(false);
  var breaks = 0;

  

  const handleTimerEnd = () => {
    setIsTimerRunning(false);
    setIsStarted(true);

    let permission = Notification.permission;
    if(permission === "granted") {
      showNotification();
    } 


    if (eventTitle === "Study") {
      if (breaks === 2) {
        breaks = 0;
        setEventTitle("Break");
        setInitialMinutes(30);
        setIsTimerRunning(true);
        return;
      } else {
        breaks += 1;
        setEventTitle("Break");
        setInitialMinutes(5);
        setIsTimerRunning(true);
        return;
      }
    } else if (eventTitle === "Break") {
      setEventTitle("Study");
      setInitialMinutes(30);
      setIsTimerRunning(true);
      return;
    }
  };

  const startTimer = () => {
    setIsStarted(true);
    setIsTimerRunning(true);
  };

  return (
    <div className="app">
      {!isStarted ? (
        <button className='btn-act' id='btn-strt' onClick={startTimer}>Start Timer</button>
      ) : (
        <Timer initialMinutes={initialMinutes} onTimerEnd={handleTimerEnd} titleState={eventTitle} />
      )}
    </div>
  );
}

export default App;
