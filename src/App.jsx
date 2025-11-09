import React, { useState, useEffect } from "react";
import "./App.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function App() {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || {}
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [inputs, setInputs] = useState({ text: "", time: "" });
  const radius = 280;
  const angleStepDeg = 360 / days.length;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleCardClick = (index) => {
    if (index === activeIndex)
      setFlippedIndex(flippedIndex === index ? null : index);
    else {
      setActiveIndex(index);
      setFlippedIndex(null);
    }
  };

  const addTask = (index) => {
    if (!inputs.text.trim()) return;
    const day = days[index];
    const updated = { ...tasks };
    if (!updated[day]) updated[day] = [];
    updated[day].push({
      task: inputs.text,
      time: inputs.time || "—",
      createdAt: new Date().toLocaleString(),
      done: false,
    });
    setTasks(updated);
    setInputs({ text: "", time: "" });
    setFlippedIndex(index);
  };

  const removeTask = (day, i) => {
    const updated = { ...tasks };
    updated[day].splice(i, 1);
    setTasks(updated);
  };

  const toggleDone = (day, i) => {
    const updated = { ...tasks };
    updated[day][i].done = !updated[day][i].done;
    setTasks(updated);
  };

  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + days.length) % days.length);
    setFlippedIndex(null);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % days.length);
    setFlippedIndex(null);
  };

  const carouselRotation = -activeIndex * angleStepDeg;

  const cardBackgrounds = [
    "linear-gradient(145deg, #272727ff, #ee8062ff)",
    "linear-gradient(145deg, #222222ff, #42c1fcff)",
    "linear-gradient(145deg, #1b1b1bff, #4589ffff)",
    "linear-gradient(145deg, #131312ff, #49d3daff)",
    "linear-gradient(145deg, #242424ff, #47c2ffff)",
    "linear-gradient(145deg, #252525ff, #ec6a3fff)",
    "linear-gradient(145deg, #191919ff, #eaff4eff)",
  ];

  return (
    <div className="app">
      {/* 🔹 Navbar */}
      <nav className="navbar">
        <div className="logo">ToDo</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#workflow">Workflow</a>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <header className="app-header" id="about">
        <h1>ToDo List</h1>
        <p>
          A futuristic way to visualize your week — plan, track, and complete
          tasks using rotating interface.
        </p>
      </header>

      {/* 🔹 3D ToDo Dashboard */}
      <div className="carousel-wrapper" id="dashboard">
        <button className="nav-btn left" onClick={rotateLeft}>
          ⟵
        </button>

        <div
          className="carousel"
          style={{ transform: `rotateY(${carouselRotation}deg)` }}
        >
          {days.map((day, idx) => {
            const isFlipped = flippedIndex === idx;
            const isActive = activeIndex === idx;

            return (
              <div
                key={day}
                className={`card ${isActive ? "active" : ""}`}
                style={{
                  transform: `rotateY(${
                    idx * angleStepDeg
                  }deg) translateZ(${radius}px)`,
                  background: cardBackgrounds[idx],
                }}
                onClick={() => handleCardClick(idx)}
              >
                <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
                  <div className="card-front">
                    <h3>{day}</h3>
                    <p>{(tasks[day] || []).length} Tasks</p>
                    {isActive && <small className="hint">Click to flip</small>}
                  </div>

                  <div className="card-back">
                    <h4>{day} Tasks</h4>
                    <div className="task-list">
                      {(tasks[day] || []).length === 0 ? (
                        <p className="no-tasks">No tasks yet.</p>
                      ) : (
                        <ul>
                          {(tasks[day] || []).map((t, i) => (
                            <li key={i} className={t.done ? "done" : ""}>
                              <div>
                                <strong>{t.task}</strong>
                                <div className="task-meta">
                                  <span>{t.time}</span> |{" "}
                                  <small>{t.createdAt}</small>
                                </div>
                              </div>
                              <div className="actions">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDone(day, i);
                                  }}
                                >
                                  ✔
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTask(day, i);
                                  }}
                                >
                                  ✖
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <form
                      onClick={(e) => e.stopPropagation()}
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addTask(idx);
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Add task..."
                        value={inputs.text}
                        onChange={(e) =>
                          setInputs((s) => ({ ...s, text: e.target.value }))
                        }
                      />
                      <input
                        type="time"
                        value={inputs.time}
                        onChange={(e) =>
                          setInputs((s) => ({ ...s, time: e.target.value }))
                        }
                      />
                      <button type="submit">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="nav-btn right" onClick={rotateRight}>
          ⟶
        </button>
      </div>

      {/* 🔹 Workflow Section */}
      <section id="workflow" className="workflow-section">
        <h2>How the 3D Workflow Operates</h2>
        <div className="workflow-cards">
          <div className="workflow-card">
            <h3>1️⃣ Plan Your Week</h3>
            <p>
              Each card represents a day. Click to open and set up your
              priorities, times, and notes.
            </p>
          </div>
          <div className="workflow-card">
            <h3>2️⃣ Visualize in 3D</h3>
            <p>
              Rotate the carousel to view all days — get a beautiful overview of
              your week at a glance.
            </p>
          </div>
          <div className="workflow-card">
            <h3>3️⃣ Track & Complete</h3>
            <p>
              Mark tasks done ✔, remove ✖, and monitor timestamps for when tasks
              were created.
            </p>
          </div>
          <div className="workflow-card">
            <h3>4️⃣ Save Progress Automatically</h3>
            <p>
              Your data stays locally stored — even if you close or refresh the
              page, your progress remains.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">Font-End</footer>
    </div>
  );
}
