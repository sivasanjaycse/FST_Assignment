import { useState, useEffect } from "react";

function calculateTimeLeft(dueDate) {
  if (!dueDate) return null;
  const difference = +new Date(dueDate) - +new Date();
  let timeLeft = {};
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    return { overdue: true };
  }
  return timeLeft;
}

function TodoTimer({ dueDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(dueDate));

  useEffect(() => {
    if (!timeLeft || timeLeft.overdue) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(dueDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [dueDate, timeLeft]);

  if (!timeLeft) return <span className="timer-info">No due date set.</span>;
  if (timeLeft.overdue)
    return <span className="timer-info overdue">Task is overdue!</span>;

  const timerString = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s left`;
  return <span className="timer-info">{timerString}</span>;
}
export default TodoTimer;
