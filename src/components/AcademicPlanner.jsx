import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirebase';
import { Plus, Target, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react';

const AcademicPlanner = ({ user }) => {
  const { data: goals, saveData: saveGoal } = useFirestore('goals', user?.uid);
  const { data: assignments, saveData: saveAssignment } = useFirestore('assignments', user?.uid);
  const [localGoals, setLocalGoals] = useState([]);
  const [localAssignments, setLocalAssignments] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
    type: 'assignment'
  });

  useEffect(() => {
    if (goals.length > 0) setLocalGoals(goals);
  }, [goals]);

  useEffect(() => {
    if (assignments.length > 0) setLocalAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(localGoals));
    localStorage.setItem('assignments', JSON.stringify(localAssignments));
  }, [localGoals, localAssignments]);

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString()
      };
      setLocalGoals([...localGoals, goal]);
      if (user) saveGoal(goal.id.toString(), goal);
      setNewGoal('');
    }
  };

  const addAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      const assignment = {
        ...newAssignment,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setLocalAssignments([...localAssignments, assignment]);
      if (user) saveAssignment(assignment.id.toString(), assignment);
      setNewAssignment({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        type: 'assignment'
      });
    }
  };

  const updateProgress = (goalId, progress) => {
    const updatedGoals = localGoals.map(goal => 
      goal.id === goalId ? { ...goal, progress } : goal
    );
    setLocalGoals(updatedGoals);
    if (user) {
      const goal = updatedGoals.find(g => g.id === goalId);
      saveGoal(goalId.toString(), goal);
    }
  };

  const toggleComplete = (id, type) => {
    if (type === 'goal') {
      const updatedGoals = localGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      );
      setLocalGoals(updatedGoals);
      if (user) {
        const goal = updatedGoals.find(g => g.id === id);
        saveGoal(id.toString(), goal);
      }
    } else {
      const updatedAssignments = localAssignments.map(assignment => 
        assignment.id === id ? { ...assignment, completed: !assignment.completed } : assignment
      );
      setLocalAssignments(updatedAssignments);
      if (user) {
        const assignment = updatedAssignments.find(a => a.id === id);
        saveAssignment(id.toString(), assignment);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-green-100 border-green-500 text-green-800';
    }
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const upcoming = localAssignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && !assignment.completed;
    });
    return upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Deadlines Alert */}
      {getUpcomingDeadlines().length > 0 && (
        <div className="glass rounded-2xl p-6 border-l-4 border-red-500 card-hover">
          <h3 className="text-red-800 font-semibold mb-3 flex items-center gap-2">
            🚨 <AlertTriangle className="w-5 h-5" /> Upcoming Deadlines
          </h3>
          {getUpcomingDeadlines().map(assignment => (
            <div key={assignment.id} className="text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Semester Goals */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            📚 <Target className="w-5 h-5" /> Semester Goals
          </h2>
          
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a new goal..."
                className="flex-1 p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <button
                onClick={addGoal}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                ➕ Add
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {localGoals.map(goal => (
              <div key={goal.id} className="border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm sm:text-base ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.text}
                  </span>
                  <button
                    onClick={() => toggleComplete(goal.id, 'goal')}
                    className={`px-2 py-1 rounded text-xs sm:text-sm ${
                      goal.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {goal.completed ? '✓' : '○'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Progress:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs sm:text-sm text-purple-600 font-semibold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments & Deadlines */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            📝 <Calendar className="w-5 h-5" /> Assignments & Deadlines
          </h2>
          
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
              placeholder="Assignment title..."
              className="w-full p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                placeholder="Subject"
                className="flex-1 p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={newAssignment.type}
                onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                className="p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className="flex-1 p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={newAssignment.priority}
                onChange={(e) => setNewAssignment({...newAssignment, priority: e.target.value})}
                className="p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                onClick={addAssignment}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                ➕ Add
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {localAssignments
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(assignment => (
              <div key={assignment.id} className={`border-l-4 p-3 rounded-lg ${getPriorityColor(assignment.priority)}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className={`font-semibold text-sm sm:text-base ${assignment.completed ? 'line-through' : ''}`}>
                        {assignment.title}
                      </span>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded w-fit">
                        {assignment.type}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm mt-1">
                      <span className="font-medium">{assignment.subject}</span> • 
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleComplete(assignment.id, 'assignment')}
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
                      assignment.completed ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border'
                    }`}
                  >
                    {assignment.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicPlanner;