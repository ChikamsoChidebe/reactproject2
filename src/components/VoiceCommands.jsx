import React, { useState, useEffect } from 'react';

const VoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!voiceSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setTranscript(command);
      processVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      setTranscript(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command) => {
    setLastCommand(command);
    
    // Add assignment command
    if (command.includes('add assignment') || command.includes('add task')) {
      const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      
      // Extract subject and due date from command
      let subject = 'General';
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Default to next week
      
      if (command.includes('math')) subject = 'Mathematics';
      else if (command.includes('physics')) subject = 'Physics';
      else if (command.includes('chemistry')) subject = 'Chemistry';
      else if (command.includes('biology')) subject = 'Biology';
      
      if (command.includes('tomorrow')) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (command.includes('next week')) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
      } else if (command.includes('friday')) {
        dueDate = new Date();
        const daysUntilFriday = (5 - dueDate.getDay() + 7) % 7;
        dueDate.setDate(dueDate.getDate() + daysUntilFriday);
      }
      
      const newAssignment = {
        id: Date.now(),
        title: command.replace(/add assignment|add task|for|due|next|tomorrow|friday|math|physics|chemistry|biology/gi, '').trim(),
        subject,
        dueDate: dueDate.toISOString().split('T')[0],
        priority: 'medium',
        type: 'assignment',
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      assignments.push(newAssignment);
      localStorage.setItem('assignments', JSON.stringify(assignments));
      
      setTranscript(`✅ Added assignment: ${newAssignment.title} for ${subject}`);
      return;
    }
    
    // Add note command
    if (command.includes('add note') || command.includes('take note')) {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      
      const noteContent = command.replace(/add note|take note|about|for/gi, '').trim();
      const newNote = {
        id: Date.now(),
        title: `Voice Note - ${new Date().toLocaleDateString()}`,
        content: noteContent,
        subject: '',
        tags: ['voice-note'],
        attachments: [],
        collaborators: ['Uche Nora', 'Chikamso Chidebe'],
        lastModified: new Date().toISOString()
      };
      
      notes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(notes));
      
      setTranscript(`📝 Added note: ${noteContent}`);
      return;
    }
    
    // Start timer command
    if (command.includes('start timer') || command.includes('start study')) {
      setTranscript('🍅 Timer feature activated! Go to Timer tab to start.');
      return;
    }
    
    // Set reminder command
    if (command.includes('remind me') || command.includes('set reminder')) {
      setTranscript('⏰ Reminder noted! Check your planner for upcoming deadlines.');
      return;
    }
    
    // Default response
    setTranscript(`🤔 I heard: "${command}" but didn't understand the command. Try "add assignment", "add note", or "start timer".`);
  };

  const quickCommands = [
    {
      command: 'Add assignment for Math due next Friday',
      description: 'Quickly add assignments with subject and due date'
    },
    {
      command: 'Add note about photosynthesis process',
      description: 'Create notes with voice input'
    },
    {
      command: 'Start timer for Physics study',
      description: 'Begin a study session'
    },
    {
      command: 'Remind me about Chemistry exam',
      description: 'Set reminders for important events'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Voice Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">🎤 Voice Commands</h2>
        
        {!voiceSupported ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚫</div>
            <p className="text-gray-600">Voice recognition is not supported in your browser.</p>
            <p className="text-sm text-gray-500 mt-2">Try using Chrome or Edge for voice features.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <button
                onClick={startListening}
                disabled={isListening}
                className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all ${
                  isListening 
                    ? 'bg-red-500 animate-pulse cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
                }`}
              >
                {isListening ? '🎤 Listening...' : '🎤 Start Voice Command'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {isListening ? 'Listening for your command...' : 'Last Command Result:'}
              </h3>
              <p className="text-gray-700">{transcript || 'No commands yet. Click the button above to start!'}</p>
            </div>

            {lastCommand && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-purple-800 mb-2">Last Processed Command:</h3>
                <p className="text-purple-700">"{lastCommand}"</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Command Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">💡 Voice Command Examples</h3>
        
        <div className="space-y-4">
          {quickCommands.map((item, index) => (
            <div key={index} className="border border-purple-200 rounded-lg p-4">
              <div className="font-medium text-gray-800 mb-2">
                "{item.command}"
              </div>
              <div className="text-sm text-gray-600">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Natural Language Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">🗣️ Natural Language Understanding</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Supported Commands</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• "Add assignment for [subject] due [date]"</li>
              <li>• "Add note about [topic]"</li>
              <li>• "Start timer for [subject]"</li>
              <li>• "Remind me about [event]"</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📅 Date Recognition</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• "tomorrow" → Next day</li>
              <li>• "next Friday" → Coming Friday</li>
              <li>• "next week" → 7 days from now</li>
              <li>• Default: 1 week from today</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">⚙️ Voice Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-800">Language</div>
              <div className="text-sm text-gray-600">Voice recognition language</div>
            </div>
            <select className="p-2 border border-purple-300 rounded-lg">
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-800">Auto-save Commands</div>
              <div className="text-sm text-gray-600">Automatically save recognized commands</div>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommands;