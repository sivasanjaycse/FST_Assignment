import { useState } from "react";

function CubeCard({ onSave, tasks }) {
  const [task, setTask] = useState("");
  const [day, setDay] = useState("Monday");
  const [isFlipped, setIsFlipped] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = (e) => {
    e.stopPropagation();
    if (!task.trim()) return;
    const newTask = { id: Date.now(), text: task, day };
    onSave(newTask);
    setTask("");
    setSuccess("✅ Saved");
    setTimeout(() => setSuccess(""), 1500);
  };

  return (
    <div
      className={`cube-wrapper ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="cube">
        <div className="face front">
          <h2>Add Task</h2>
          <input
            type="text"
            value={task}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
          />
          <select
            value={day}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setDay(e.target.value)}
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
          <button onClick={handleSave}>Save</button>
          {success && <p className="success-msg">{success}</p>}
        </div>

        <div className="face back">
          <h2>{day} Tasks</h2>
          <ul>
            {tasks
              .filter((t) => t.day === day)
              .map((t) => (
                <li key={t.id}>{t.text}</li>
              ))}
          </ul>
          {tasks.filter((t) => t.day === day).length === 0 && (
            <p className="empty">No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CubeCard;
