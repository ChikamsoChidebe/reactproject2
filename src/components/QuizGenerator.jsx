import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const QuizGenerator = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: Array(16).fill().map((_, i) => ({
      id: i + 1,
      question: '',
      options: ['', '', '', ''],
      correct: 0
    }))
  });

  useEffect(() => {
    loadQuizzes();
  }, [user]);

  const loadQuizzes = async () => {
    if (!user) return;
    const q = query(collection(db, 'quizzes'));
    const snapshot = await getDocs(q);
    setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const saveQuiz = async () => {
    if (!user || !newQuiz.title) return;
    
    const validQuestions = newQuiz.questions.filter(q => 
      q.question && q.options.every(opt => opt.trim())
    );

    if (validQuestions.length < 5) {
      alert('Please add at least 5 complete questions');
      return;
    }

    await addDoc(collection(db, 'quizzes'), {
      ...newQuiz,
      questions: validQuestions,
      createdBy: user.uid,
      createdAt: new Date(),
      scores: {}
    });

    setNewQuiz({
      title: '',
      questions: Array(16).fill().map((_, i) => ({
        id: i + 1,
        question: '',
        options: ['', '', '', ''],
        correct: 0
      }))
    });
    loadQuizzes();
  };

  const takeQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setAnswers({});
    setScore(null);
    setShowResults(false);
  };

  const submitQuiz = async () => {
    if (!currentQuiz || !user) return;

    let correct = 0;
    currentQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) correct++;
    });

    const finalScore = Math.round((correct / currentQuiz.questions.length) * 100);
    setScore(finalScore);

    // Save score to Firestore
    const quizRef = doc(db, 'quizzes', currentQuiz.id);
    await updateDoc(quizRef, {
      [`scores.${user.uid}`]: {
        score: finalScore,
        answers,
        completedAt: new Date(),
        userName: user.displayName
      }
    });

    // Check if both users completed
    const updatedQuiz = { ...currentQuiz };
    updatedQuiz.scores = updatedQuiz.scores || {};
    updatedQuiz.scores[user.uid] = { score: finalScore };

    const completedUsers = Object.keys(updatedQuiz.scores).length;
    if (completedUsers >= 2) {
      setShowResults(true);
    }

    loadQuizzes();
  };

  const updateQuestion = (index, field, value) => {
    const updated = { ...newQuiz };
    if (field === 'question') {
      updated.questions[index].question = value;
    } else if (field.startsWith('option')) {
      const optIndex = parseInt(field.split('_')[1]);
      updated.questions[index].options[optIndex] = value;
    } else if (field === 'correct') {
      updated.questions[index].correct = parseInt(value);
    }
    setNewQuiz(updated);
  };

  return (
    <div className="space-y-6">
      {!currentQuiz ? (
        <>
          {/* Quiz List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-purple-800 mb-4">📝 Available Quizzes</h2>
            <div className="grid gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">{quiz.questions.length} questions</p>
                      {quiz.scores && (
                        <div className="mt-2">
                          {Object.entries(quiz.scores).map(([uid, data]) => (
                            <span key={uid} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                              {data.userName}: {data.score}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => takeQuiz(quiz)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Quiz */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-purple-800 mb-4">➕ Create New Quiz</h2>
            <input
              type="text"
              placeholder="Quiz Title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
              className="w-full p-3 border rounded-lg mb-4"
            />
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {newQuiz.questions.map((q, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name={`correct_${index}`}
                        checked={q.correct === optIndex}
                        onChange={() => updateQuestion(index, 'correct', optIndex)}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuestion(index, `option_${optIndex}`, e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <button
              onClick={saveQuiz}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Quiz
            </button>
          </div>
        </>
      ) : (
        /* Take Quiz */
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-800">{currentQuiz.title}</h2>
            <button
              onClick={() => setCurrentQuiz(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Back
            </button>
          </div>

          {score === null ? (
            <div className="space-y-6">
              {currentQuiz.questions.map((q, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{index + 1}. {q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={optIndex}
                          onChange={(e) => setAnswers({...answers, [index]: parseInt(e.target.value)})}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={submitQuiz}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-4">{score}%</div>
              <p className="text-lg mb-4">Quiz completed!</p>
              {showResults && (
                <div className="mt-6 text-left">
                  <h3 className="font-bold mb-4">Correct Answers:</h3>
                  {currentQuiz.questions.map((q, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <p className="font-semibold">{index + 1}. {q.question}</p>
                      <p className="text-green-600">✓ {q.options[q.correct]}</p>
                      {answers[index] !== q.correct && (
                        <p className="text-red-600">✗ Your answer: {q.options[answers[index]]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;