import React from 'react';
import TaskList from './TaskList';

function App() {
  const [tasks, setTasks] = React.useState([]);

  const addTask = (taskName) => {
    const newTask = { id: Date.now(), name: taskName, completed: false };
    setTasks([...tasks, newTask]);
  };

  const onComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const onDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="app">
      <h1 className=' text-center text-3xl text-red-300'>Task Management App</h1>
      <TaskList tasks={tasks} onComplete={onComplete} onDelete={onDelete} />
      <button onClick={() => addTask(prompt('Enter task name:'))}>Add Task</button>
    </div>
  );
}

export default App;