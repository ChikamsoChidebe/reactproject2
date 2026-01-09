import React, { useState, useEffect } from 'react';
import { groqAPI } from '../services/groq';

const CollaborativeNotes = () => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes') || '[]'));
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: '',
    content: '',
    subject: '',
    tags: [],
    attachments: [],
    collaborators: ['Uche Nora', 'Chikamso Chidebe']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'History'];

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) return;

    const noteToSave = {
      ...currentNote,
      id: currentNote.id || Date.now(),
      lastModified: new Date().toISOString(),
      tags: currentNote.tags.filter(tag => tag.trim())
    };

    if (currentNote.id) {
      setNotes(notes.map(note => note.id === currentNote.id ? noteToSave : note));
    } else {
      setNotes([...notes, noteToSave]);
    }

    setCurrentNote({
      id: null,
      title: '',
      content: '',
      subject: '',
      tags: [],
      attachments: [],
      collaborators: ['Uche Nora', 'Chikamso Chidebe']
    });
  };

  const editNote = (note) => {
    setCurrentNote(note);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const addTag = (tag) => {
    if (tag.trim() && !currentNote.tags.includes(tag.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const generateSummary = (content) => {
    const sentences = content.split('.').filter(s => s.trim().length > 10);
    const summary = sentences.slice(0, 2).join('.') + '.';
    return summary || 'No summary available.';
  };

  const generateQuizQuestions = async (content) => {
    if (!content.trim()) return;
    
    setIsGeneratingQuiz(true);
    try {
      const response = await groqAPI.generateQuizQuestions(content);
      
      // Try to parse as JSON, fallback to simple questions
      let questions;
      try {
        questions = JSON.parse(response);
      } catch {
        // Fallback: create simple questions from response
        const lines = response.split('\n').filter(line => line.includes('?'));
        questions = lines.slice(0, 3).map((line, index) => ({
          id: index + 1,
          question: line.trim(),
          answer: 'Answer based on your notes'
        }));
      }
      
      setGeneratedQuiz(questions);
      setShowQuizGenerator(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Fallback to original method
      const sentences = content.split('.').filter(s => s.trim().length > 20);
      const questions = sentences.slice(0, 3).map((sentence, index) => {
        const words = sentence.trim().split(' ');
        const keyWord = words[Math.floor(words.length / 2)];
        return {
          id: index + 1,
          question: `What is the significance of "${keyWord}" in this context?`,
          type: 'short-answer',
          context: sentence.trim()
        };
      });
      setGeneratedQuiz(questions);
      setShowQuizGenerator(true);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const suggestResources = (subject) => {
    const resources = {
      'Mathematics': ['Khan Academy Math', 'Wolfram Alpha', 'MIT OpenCourseWare'],
      'Physics': ['PhET Simulations', 'Feynman Lectures', 'Physics Classroom'],
      'Chemistry': ['ChemSpider', 'PubChem', 'Chemistry LibreTexts'],
      'Biology': ['NCBI', 'Biology Online', 'Crash Course Biology'],
      'Computer Science': ['Stack Overflow', 'GitHub', 'Coursera CS'],
      'Literature': ['Project Gutenberg', 'Poetry Foundation', 'Literary Devices'],
      'History': ['Smithsonian', 'National Archives', 'History.com']
    };
    return resources[subject] || ['Google Scholar', 'Wikipedia', 'Library Resources'];
  };

  return (
    <div className="space-y-6">
      {/* Note Editor */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-4">📝 Collaborative Notes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
            placeholder="Note title..."
            className="p-2 sm:p-3 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={currentNote.subject}
            onChange={(e) => setCurrentNote({...currentNote, subject: e.target.value})}
            className="p-2 sm:p-3 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <textarea
          value={currentNote.content}
          onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
          placeholder="Start writing your notes here..."
          className="w-full h-32 sm:h-40 p-2 sm:p-3 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
        />

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {currentNote.tags.map(tag => (
            <span key={tag} className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="text-purple-600 hover:text-purple-800">×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag..."
            className="px-2 sm:px-3 py-1 border border-purple-300 rounded-full text-xs sm:text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addTag(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <button
            onClick={saveNote}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {currentNote.id ? 'Update Note' : 'Save Note'}
          </button>
          {currentNote.content && (
            <button
              onClick={() => generateQuizQuestions(currentNote.content)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate Quiz
            </button>
          )}
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          <span className="font-medium">Collaborators:</span> {currentNote.collaborators.join(', ')}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base pr-2">{note.title}</h3>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => editNote(note)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {note.subject && (
              <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mb-2 inline-block">
                {note.subject}
              </div>
            )}
            
            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
              {generateSummary(note.content)}
            </p>
            
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
                )}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Modified: {new Date(note.lastModified).toLocaleDateString()}
            </div>

            {/* Suggested Resources */}
            {note.subject && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1">Suggested Resources:</div>
                <div className="flex flex-wrap gap-1">
                  {suggestResources(note.subject).slice(0, 2).map(resource => (
                    <span key={resource} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quiz Generator Modal */}
      {showQuizGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-bold text-purple-800">🧠 Generated Quiz Questions</h3>
              <button
                onClick={() => setShowQuizGenerator(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {generatedQuiz.map(question => (
                <div key={question.id} className="border border-purple-200 rounded-lg p-3 sm:p-4">
                  <div className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                    Q{question.id}: {question.question}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    Context: {question.context}
                  </div>
                  <textarea
                    placeholder="Your answer..."
                    className="w-full mt-2 p-2 border border-gray-300 rounded text-xs sm:text-sm"
                    rows="2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeNotes;