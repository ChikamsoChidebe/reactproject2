import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskName.trim() === '' || dueDate.trim() === '') {
      setFeedback('Task name and due date are required!');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      dueDate,
      priority,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setDueDate('');
    setPriority('Low');
    setFeedback('Task added successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const onComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    setFeedback('Task status updated!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const onDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setFeedback('Task deleted successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDragStart = (index) => {
    setDraggedTaskIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedTaskIndex === index) return;

    const reorderedTasks = [...tasks];
    const [draggedTask] = reorderedTasks.splice(draggedTaskIndex, 1);
    reorderedTasks.splice(index, 0, draggedTask);

    setDraggedTaskIndex(index);
    setTasks(reorderedTasks);
  };

  const handleDragEnd = () => {
    setDraggedTaskIndex(null);
    setFeedback('Task order updated!');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="app bg-gray-100 min-h-screen p-6 flex flex-col">
      <h1 className="text-center text-4xl font-bold text-red-600 mb-6">
        Task Management App
      </h1>

      {feedback && (
        <div className="feedback bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center">
          {feedback}
        </div>
      )}

      <div className="add-task bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Add a New Task</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="task-list bg-white shadow-md rounded-lg p-4 flex-grow">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(index);
            }}
            onDragEnd={handleDragEnd}
            className="task-item flex flex-col bg-gray-100 p-3 mb-2 rounded-lg shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onComplete(task.id)}
                  className="mr-2"
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.name}
                </span>
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>Due Date: {task.dueDate}</p>
              <p>
                Priority:{' '}
                <span
                  className={`font-bold ${
                    task.priority === 'High'
                      ? 'text-red-500'
                      : task.priority === 'Medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}
                >
                  {task.priority}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 text-center py-4 mt-6 rounded-lg">
        Chidebe Chkamso &copy; {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
}

export default App;