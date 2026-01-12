import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateQuizFromText, generateQuizFromTopic, extractTextFromFile } from '../services/aiQuiz';
import { Upload, Brain, FileText, Trophy, Clock } from 'lucide-react';

const QuizGenerator = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('take'); // take, create, upload, topic
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Creation states
  const [uploadFile, setUploadFile] = useState(null);
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: []
  });
  const [manualQuestion, setManualQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: ''
  });

  useEffect(() => {
    loadQuizzes();
  }, [user]);

  useEffect(() => {
    let timer;
    if (currentQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuiz, timeLeft]);

  const loadQuizzes = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(db, 'quizzes'));
      const allQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt in JavaScript instead of Firestore
      const sortedQuizzes = allQuizzes.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return bTime - aTime;
      });
      setQuizzes(sortedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!user || !confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      loadQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz. Please try again.');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !user) return;
    
    setLoading(true);
    try {
      const text = await extractTextFromFile(uploadFile);
      const questions = await generateQuizFromText(text, numQuestions);
      
      const quiz = {
        title: `Quiz from ${uploadFile.name}`,
        questions,
        createdBy: user.uid,
        createdAt: new Date(),
        type: 'ai-generated',
        source: 'file-upload'
      };
      
      await addDoc(collection(db, 'quizzes'), quiz);
      setUploadFile(null);
      loadQuizzes();
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error processing file. Please try again.');
    }
    setLoading(false);
  };

  const handleTopicGeneration = async () => {
    if (!topic.trim() || !user) return;
    
    setLoading(true);
    try {
      const questions = await generateQuizFromTopic(topic, numQuestions);
      
      const quiz = {
        title: `${topic} Quiz`,
        questions,
        createdBy: user.uid,
        createdAt: new Date(),
        type: 'ai-generated',
        source: 'topic-based'
      };
      
      await addDoc(collection(db, 'quizzes'), quiz);
      setTopic('');
      loadQuizzes();
    } catch (error) {
      console.error('Topic generation error:', error);
      alert('Error generating quiz. Please try again.');
    }
    setLoading(false);
  };

  const addManualQuestion = () => {
    if (!manualQuestion.question || !manualQuestion.options.every(opt => opt.trim())) return;
    
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...manualQuestion, id: Date.now() }]
    });
    
    setManualQuestion({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: ''
    });
  };

  const saveManualQuiz = async () => {
    if (!newQuiz.title || newQuiz.questions.length === 0 || !user) return;
    
    const quiz = {
      ...newQuiz,
      createdBy: user.uid,
      createdAt: new Date(),
      type: 'manual',
      source: 'user-created'
    };
    
    await addDoc(collection(db, 'quizzes'), quiz);
    setNewQuiz({ title: '', questions: [] });
    loadQuizzes();
  };

  const takeQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setAnswers({});
    setScore(null);
    setShowResults(false);
    setProgress(0);
    setTimeLeft(quiz.questions.length * 60); // 1 minute per question
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
    setProgress(((Object.keys(answers).length + 1) / currentQuiz.questions.length) * 100);
  };

  const submitQuiz = async () => {
    if (!currentQuiz || !user) return;

    let correct = 0;
    currentQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) correct++;
    });

    const finalScore = Math.round((correct / currentQuiz.questions.length) * 100);
    setScore(finalScore);

    // Save score to Firebase
    const scoreData = {
      quizId: currentQuiz.id,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      score: finalScore,
      answers,
      completedAt: new Date(),
      timeSpent: (currentQuiz.questions.length * 60) - timeLeft
    };

    await addDoc(collection(db, 'quiz-scores'), scoreData);
    setShowResults(true);
    loadQuizzes();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-purple-800">{currentQuiz.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setCurrentQuiz(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Exit
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {score === null ? (
          /* Taking Quiz */
          <div className="space-y-6">
            {currentQuiz.questions.map((q, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {index + 1}. {q.question}
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label 
                      key={optIndex} 
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[index] === optIndex 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question_${index}`}
                        value={optIndex}
                        checked={answers[index] === optIndex}
                        onChange={() => handleAnswer(index, optIndex)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="text-center">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== currentQuiz.questions.length}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-purple-600 mb-2">{score}%</div>
              <p className="text-xl text-gray-700">Quiz Completed!</p>
              <div className="flex justify-center items-center gap-2 mt-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">
                  {score >= 90 ? 'Excellent!' : score >= 70 ? 'Good Job!' : 'Keep Practicing!'}
                </span>
              </div>
            </div>

            {showResults && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Review Answers:</h3>
                {currentQuiz.questions.map((q, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                    <div className="space-y-1">
                      <p className="text-green-600">✓ Correct: {q.options[q.correct]}</p>
                      {answers[index] !== q.correct && (
                        <p className="text-red-600">✗ Your answer: {q.options[answers[index]]}</p>
                      )}
                      {q.explanation && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'take', label: '📝 Take Quiz', icon: FileText },
            { id: 'upload', label: '📁 Upload File', icon: Upload },
            { id: 'topic', label: '🧠 AI Topic', icon: Brain },
            { id: 'create', label: '✏️ Manual Create', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'take' && (
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">📝 Available Quizzes</h2>
            <div className="grid gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">{quiz.questions.length} questions</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => takeQuiz(quiz)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Take Quiz
                      </button>
                      {quiz.createdBy === user?.uid && (
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">📁 Upload File for Quiz</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="mb-4"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-600 mb-4">Selected: {uploadFile.name}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Number of Questions:</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-20 p-2 border rounded"
                />
              </div>
              
              <button
                onClick={handleFileUpload}
                disabled={!uploadFile || loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Generating Quiz...' : 'Generate Quiz from File'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'topic' && (
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">🧠 AI Topic Quiz</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter topic (e.g., 'JavaScript Arrays', 'World War 2', 'Photosynthesis')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Number of Questions:</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-20 p-2 border rounded"
                />
              </div>
              
              <button
                onClick={handleTopicGeneration}
                disabled={!topic.trim() || loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Generating Quiz...' : 'Generate Quiz from Topic'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">✏️ Create Manual Quiz</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Quiz Title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              
              {/* Add Question Form */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-3">Add New Question</h3>
                <input
                  type="text"
                  placeholder="Question"
                  value={manualQuestion.question}
                  onChange={(e) => setManualQuestion({...manualQuestion, question: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                />
                
                {manualQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={manualQuestion.correct === index}
                      onChange={() => setManualQuestion({...manualQuestion, correct: index})}
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...manualQuestion.options];
                        newOptions[index] = e.target.value;
                        setManualQuestion({...manualQuestion, options: newOptions});
                      }}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                ))}
                
                <input
                  type="text"
                  placeholder="Explanation (optional)"
                  value={manualQuestion.explanation}
                  onChange={(e) => setManualQuestion({...manualQuestion, explanation: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                />
                
                <button
                  onClick={addManualQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
              
              {/* Questions List */}
              {newQuiz.questions.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h3 className="font-semibold">Questions ({newQuiz.questions.length})</h3>
                  {newQuiz.questions.map((q, index) => (
                    <div key={index} className="border rounded p-3 bg-white">
                      <p className="font-medium">{index + 1}. {q.question}</p>
                      <p className="text-sm text-green-600">✓ {q.options[q.correct]}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={saveManualQuiz}
                disabled={!newQuiz.title || newQuiz.questions.length === 0}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Save Quiz ({newQuiz.questions.length} questions)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;