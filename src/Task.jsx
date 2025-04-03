import React from 'react';

const Task = ({ task, onToggle, onDelete }) => {
    return (
        <div className={`task ${task.completed ? 'completed' : ''}`}>
            <h3>
                {task.title}
                <button onClick={() => onToggle(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
                    Delete
                </button>
            </h3>
            <p>{task.description}</p>
        </div>
    );
    
};

export default Task;