function TaskItem({ task, isActive, onSelect, onToggleComplete, onDelete }) {
  return (
    <div className={`task-item ${isActive ? 'active' : ''} ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggleComplete}
        className="task-checkbox"
      />
      <div className="task-content" onClick={onSelect}>
        <h3 className="task-title">{task.title}</h3>
        <div className="task-meta">
          {task.pomodoroCount > 0 && (
            <span className="pomodoro-badge">🍅 × {task.pomodoroCount}</span>
          )}
        </div>
      </div>
      <button onClick={onDelete} className="delete-button">🗑️</button>
    </div>
  );
}
export default TaskItem;