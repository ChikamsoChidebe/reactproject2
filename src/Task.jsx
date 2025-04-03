import React from 'react';

function Task({ task, onComplete, onDelete }) {
  return (
    <div className="task">
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => onComplete(task.id)}     
      />
      <span className={task.completed ? 'completed' : ''}>{task.name}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default Task;