import { useState, useEffect, useRef } from 'react';

function PomodoroTimer({ onComplete }) {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        onComplete();
        alert('Pomodoro complete!');
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        alert('Break over!');
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`pomodoro-timer ${isBreak ? 'break-mode' : 'work-mode'}`}>
      <div className="timer-mode">{isBreak ? '☕ Break Time' : '🍅 Focus Time'}</div>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className="control-button primary">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="control-button secondary">Reset</button>
      </div>
    </div>
  );
}
export default PomodoroTimer;