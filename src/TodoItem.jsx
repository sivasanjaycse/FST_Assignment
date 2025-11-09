import React, { useRef } from "react";
import TodoTimer from "./TodoTimer";

function TodoItem({ todo, onToggleComplete, onDelete, onFormatDate }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    if (card.classList.contains("is-flipping")) return;

    const { clientWidth: width, clientHeight: height } = card;
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    // --- HIGH INTENSITY CHANGE HERE ---
    // The multiplier is now 60 (was 25) for a much stronger tilt
    const rotateY = (x / width - 0.5) * 60; // <-- HIGH INTENSITY
    const rotateX = (y / height - 0.5) * -60; // <-- HIGH INTENSITY

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.transition = "none";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  };

  const handleToggle = () => {
    const card = cardRef.current;

    card.classList.add("is-flipping");
    onToggleComplete(todo.id);

    setTimeout(() => {
      card.classList.remove("is-flipping");
    }, 600); // Must match CSS transition duration
  };

  return (
    <li
      ref={cardRef}
      className="todo-item"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`card-flipper ${todo.completed ? "is-flipped" : ""}`}>
        {/* --- CARD FRONT --- */}
        <div className="card-face card-front">
          <div className="todo-content">
            <span className="todo-text" onClick={handleToggle}>
              {todo.text}
            </span>
            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
              &times;
            </button>
          </div>
          <div className="todo-details">
            <span className="due-date">Due: {onFormatDate(todo.dueDate)}</span>
            <TodoTimer dueDate={todo.dueDate} />
          </div>
        </div>

        {/* --- CARD BACK (Completed State) --- */}
        <div className="card-face card-back">
          <div className="todo-content">
            <span className="todo-text" onClick={handleToggle}>
              {todo.text}
            </span>
          </div>
          <div className="todo-details-back">
            <span className="completed-icon">&#10004;</span>
            COMPLETED
          </div>
        </div>
      </div>
    </li>
  );
}

export default TodoItem;
