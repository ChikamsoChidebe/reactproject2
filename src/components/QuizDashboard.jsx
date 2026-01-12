import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Trophy, TrendingUp, Clock, Target } from 'lucide-react';

const QuizDashboard = ({ user }) => {
  const [scores, setScores] = useState([]);
  const [partnerScores, setPartnerScores] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    recentTests: 0
  });

  useEffect(() => {
    if (!user) return;

    // Listen to all quiz scores and filter in JavaScript
    const allScoresQuery = collection(db, 'quiz-scores');

    const unsubscribe = onSnapshot(allScoresQuery, (snapshot) => {
      const allScores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter user scores in JavaScript
      const userScores = allScores
        .filter(score => score.userId === user.uid)
        .sort((a, b) => {
          const aTime = a.completedAt?.toDate?.() || new Date(a.completedAt) || new Date(0);
          const bTime = b.completedAt?.toDate?.() || new Date(b.completedAt) || new Date(0);
          return bTime - aTime;
        });
      
      // Filter partner scores in JavaScript
      const partnerScores = allScores
        .filter(score => score.userId !== user.uid)
        .sort((a, b) => {
          const aTime = a.completedAt?.toDate?.() || new Date(a.completedAt) || new Date(0);
          const bTime = b.completedAt?.toDate?.() || new Date(b.completedAt) || new Date(0);
          return bTime - aTime;
        })
        .slice(0, 5);
      
      setScores(userScores);
      setPartnerScores(partnerScores);
      calculateStats(userScores);
    });

    return () => unsubscribe();
  }, [user]);

  const calculateStats = (userScores) => {
    if (userScores.length === 0) {
      setStats({ totalQuizzes: 0, averageScore: 0, highestScore: 0, recentTests: 0 });
      return;
    }

    const totalQuizzes = userScores.length;
    const averageScore = Math.round(userScores.reduce((sum, score) => sum + score.score, 0) / totalQuizzes);
    const highestScore = Math.max(...userScores.map(score => score.score));
    
    // Recent tests (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentTests = userScores.filter(score => 
      score.completedAt.toDate() >= weekAgo
    ).length;

    setStats({ totalQuizzes, averageScore, highestScore, recentTests });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 70) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 50) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalQuizzes}</div>
          <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <Target className="w-4 h-4" />
            Total Quizzes
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}%
          </div>
          <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Average Score
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.highestScore)}`}>
            {stats.highestScore}%
          </div>
          <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4" />
            Highest Score
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.recentTests}</div>
          <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            This Week
          </div>
        </div>
      </div>

      {/* Recent Scores */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Your Scores */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Your Recent Scores</h3>
          <div className="space-y-3">
            {scores.slice(0, 5).map(score => {
              const badge = getPerformanceBadge(score.score);
              return (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Quiz Score</div>
                    <div className="text-sm text-gray-600">
                      {score.completedAt.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              );
            })}
            {scores.length === 0 && (
              <p className="text-gray-500 text-center py-4">No quiz scores yet. Take your first quiz!</p>
            )}
          </div>
        </div>

        {/* Partner Scores */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Partner's Recent Scores</h3>
          <div className="space-y-3">
            {partnerScores.map(score => {
              const badge = getPerformanceBadge(score.score);
              return (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{score.userName}</div>
                    <div className="text-sm text-gray-600">
                      {score.completedAt.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              );
            })}
            {partnerScores.length === 0 && (
              <p className="text-gray-500 text-center py-4">No partner scores yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">Performance Trends</h3>
        <div className="h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <div className="text-lg font-medium">Performance Chart</div>
            <div className="text-sm">Visual trends coming soon!</div>
          </div>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Keep Learning, Love Eagles!</h3>
        <p className="opacity-90">
          {stats.averageScore >= 80 
            ? "Outstanding performance! You're soaring high! 🦅" 
            : "Every quiz makes you stronger. Keep pushing forward! 💪"}
        </p>
        <p className="text-purple-200 text-sm mt-2">In God We Trust ✨</p>
      </div>
    </div>
  );
};

export default QuizDashboard;