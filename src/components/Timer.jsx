import { useAppContext } from "../AppProvider";
import { useRef, useState, useEffect } from "react";

const Timer = () => {
    const { settings } = useAppContext();
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('study'); // 'study' or 'rest'
    const [cycleCount, setCycleCount] = useState(0);
    const [currentEvent, setCurrentEvent] = useState('Ready to Study');

    const intervalRef = useRef(null);

    const getBreakTime = () => {
        if (cycleCount > 0 && cycleCount % 3 === 0) {
        return settings.maxRestTime; 
        }
        return Math.max(Math.floor(settings.maxRestTime * 0.17), 1); 
    };

    const startTimer = () => {
        if (!isRunning) {
        setIsRunning(true);
        if (timeLeft === 0) {
            setCurrentPhase('study');
            setTimeLeft(settings.maxStudyTime * 60);
            setCurrentEvent('Focus Time');
            setCycleCount(0);
        }
        }
    };

    const stopTimer = () => {
        setIsRunning(false);
        if (intervalRef.current) {
        clearInterval(intervalRef.current);
        }
    };

    const restartTimer = () => {
        stopTimer();
        setTimeLeft(0);
        setCurrentPhase('study');
        setCurrentEvent('Ready to Study');
        setCycleCount(0);
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
            if (prev <= 1) {
                if (currentPhase === 'study') {
                const newCycleCount = cycleCount + 1;
                setCycleCount(newCycleCount);
                setCurrentPhase('rest');
                setCurrentEvent('Break Time');
                
                if (settings.notifications && typeof window !== 'undefined' && 'Notification' in window) {
                    new Notification('Study session complete!', {
                    body: 'Time for a well-deserved break.',
                    icon: '/favicon.ico'
                    });
                }
                
                return getBreakTime() * 60;
                } else {
                setCurrentPhase('study');
                setCurrentEvent('Focus Time');
                
                if (settings.notifications && typeof window !== 'undefined' && 'Notification' in window) {
                    new Notification('Break over!', {
                    body: 'Time to focus and study.',
                    icon: '/favicon.ico'
                    });
                }
                
                return settings.maxStudyTime * 60;
                }
            }
            return prev - 1;
            });
        }, 1000);
        } else {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        }

        return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        };
    }, [isRunning, timeLeft, currentPhase, cycleCount, settings]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = timeLeft > 0 ? 
        (currentPhase === 'study' ? 
        ((settings.maxStudyTime * 60 - timeLeft) / (settings.maxStudyTime * 60)) * 100 :
        ((getBreakTime() * 60 - timeLeft) / (getBreakTime() * 60)) * 100
        ) : 0;

    return (
        <div className="flex flex-col items-center space-y-8 p-8">
        <div className="rounded-lg px-6 py-3">
            <h2 className="text-xl font-semibold text-black-400">{currentEvent}</h2>
        </div>

        <div className="relative">
            <div className="w-80 h-80 rounded-full  border-4 border-black-900/30 flex items-center justify-center shadow-2xl">
            <div className="text-center">
                <div className="text-6xl font-mono font-bold text-black mb-2">
                {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                {currentPhase === 'study' ? 'Study Session' : 'Break Time'}
                </div>
                {cycleCount > 0 && (
                <div className="text-xs text-black-400 mt-1">
                    Session {cycleCount}
                </div>
                )}
            </div>
            </div>
            
            {timeLeft > 0 && (
            <svg className="absolute top-0 left-0 w-80 h-80 transform -rotate-90">
                <circle
                cx="160"
                cy="160"
                r="150"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-black-500/30"
                strokeDasharray={`${progress * 9.42} 942`}
                strokeLinecap="round"
                />
            </svg>
            )}
        </div>

        <div className="flex space-x-4">
            {!isRunning ? (
            <button
                onClick={startTimer}
                className="btn btn-lg bg-black border-none text-white min-w-32"
            >
                {timeLeft === 0 ? 'Start' : 'Resume'}
            </button>
            ) : (
            <button
                onClick={stopTimer}
                className="btn btn-lg btn-outline min-w-32"
            >
                Pause
            </button>
            )}
            
            <button
            onClick={restartTimer}
            className="btn btn-lg btn-outline min-w-32"
            >
            Reset
            </button>
        </div>
        </div>
    );
};

export default Timer;