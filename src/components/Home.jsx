import React from 'react';
import { Heart } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass rounded-3xl shadow-2xl p-12 text-center card-hover">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 floating">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Welcome, Love Eagles! 🦅
          </h1>
          <p className="text-xl text-gray-600 mb-2">Uche Nora & Chikamso Chidebe</p>
          <p className="text-lg text-purple-600 font-semibold bg-purple-50 px-4 py-2 rounded-full inline-block">
            In God We Trust ✨
          </p>
        </div>
        
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Your comprehensive academic planning companion designed to help you soar to new heights in your educational journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold text-lg shadow-lg btn-scale transition-all flex items-center justify-center gap-2"
            onClick={() => setActiveTab('planner')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Get Started
          </button>
          <button 
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-purple-700 rounded-xl hover:bg-white font-semibold text-lg shadow-lg btn-scale transition-all border border-purple-200 flex items-center justify-center gap-2"
            onClick={() => setActiveTab('insights')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            ),
            title: "Academic Planner",
            description: "Set semester goals, track assignments, and manage deadlines with smart priority tagging.",
            color: "from-blue-500 to-cyan-600"
          },
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: "AI-Powered Insights",
            description: "Get personalized study recommendations and performance analytics powered by AI.",
            color: "from-purple-500 to-pink-600"
          },
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            ),
            title: "Study Timer",
            description: "Pomodoro technique with break reminders and session tracking for optimal focus.",
            color: "from-green-500 to-emerald-600"
          },
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            ),
            title: "Voice Commands",
            description: "Add tasks and notes hands-free with natural language voice recognition.",
            color: "from-orange-500 to-red-500"
          },
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            ),
            title: "Mood Tracking",
            description: "Track daily mood and energy levels for personalized productivity insights.",
            color: "from-yellow-500 to-orange-500"
          },
          {
            icon: (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V8z" clipRule="evenodd" />
              </svg>
            ),
            title: "Reflection Journal",
            description: "Daily gratitude journaling and reflection for personal growth and motivation.",
            color: "from-indigo-500 to-purple-600"
          }
        ].map((feature, index) => (
          <div key={index} className="glass rounded-2xl p-6 card-hover">
            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="glass rounded-2xl p-8 card-hover">
        <h2 className="text-2xl font-bold gradient-text text-center mb-8">Your Academic Journey Starts Here</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">10+</div>
            <div className="text-gray-600">Powerful Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-gray-600">AI Assistant</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">∞</div>
            <div className="text-gray-600">Goals & Tasks</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-gray-600">Free to Use</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass rounded-2xl p-8 text-center card-hover">
        <h2 className="text-3xl font-bold gradient-text mb-4">Ready to Excel in Your Studies?</h2>
        <p className="text-lg text-gray-600 mb-6">Join Love Eagles on this journey of academic excellence and spiritual growth.</p>
        <button 
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold text-xl shadow-lg btn-scale transition-all"
          onClick={() => setActiveTab('planner')}
        >
          Start Your Journey Today
        </button>
      </div>
    </div>
  );
};

export default Home;