import { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = await createTask({ title: newTaskTitle });
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    const updatedTask = await updateTask(taskId, { completed: !task.completed });
    setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter(t => t._id !== taskId));
    if (activeTask?._id === taskId) setActiveTask(null);
  };

  const handlePomodoroComplete = async () => {
    if (!activeTask) return;
    const updatedTask = await updateTask(activeTask._id, {
      pomodoroCount: activeTask.pomodoroCount + 1
    });
    setTasks(tasks.map(t => t._id === activeTask._id ? updatedTask : t));
    setActiveTask(updatedTask);
  };

  if (loading) return <div className="app">Loading...</div>;

  return (
    <div className="app">
      <header><h1>🍅 FocusTools</h1></header>
      <div className="main-content">
        <div className="task-section">
          <h2>Tasks</h2>
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What to focus on?"
              className="task-input"
            />
            <button type="submit" className="add-button">Add</button>
          </form>
          <TaskList
            tasks={tasks}
            activeTask={activeTask}
            onSelectTask={setActiveTask}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="timer-section">
          <h2>Focus Time</h2>
          {activeTask ? (
            <>
              <div className="active-task-display">
                <p>Working on:</p><h3>{activeTask.title}</h3>
                <p>🍅 {activeTask.pomodoroCount} completed</p>
              </div>
              <PomodoroTimer onComplete={handlePomodoroComplete} />
            </>
          ) : <p>← Select a task to start focusing</p>}
        </div>
      </div>
    </div>
  );
}
export default App;