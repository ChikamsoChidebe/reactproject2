const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || 'your-groq-api-key-here';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const groqAPI = {
  async chat(messages, model = 'llama-3.1-8b-instant') {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: String(msg.content || '')
          })),
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'API Error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response';
    } catch (error) {
      console.error('Groq API Error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  },

  async generateStudyTips(userContext) {
    const messages = [
      {
        role: 'system',
        content: 'You are an AI study coach for Love Eagles (Uche Nora & Chikamso Chidebe). Provide personalized, encouraging study advice. Keep responses concise and motivational.'
      },
      {
        role: 'user',
        content: `Based on this context: ${JSON.stringify(userContext)}, provide 3 specific study tips.`
      }
    ];
    return await this.chat(messages);
  },

  async generateQuizQuestions(noteContent) {
    const messages = [
      {
        role: 'system',
        content: 'Generate 3 quiz questions from the given notes. Format as JSON array with question and answer fields.'
      },
      {
        role: 'user',
        content: noteContent
      }
    ];
    return await this.chat(messages);
  },

  async coachResponse(userQuestion, context = {}) {
    const messages = [
      {
        role: 'system',
        content: 'You are an AI study coach for Love Eagles academic planner. Be encouraging, specific, and reference their faith ("In God We Trust"). Keep responses under 150 words.'
      },
      {
        role: 'user',
        content: `Context: ${JSON.stringify(context)}\nQuestion: ${userQuestion}`
      }
    ];
    return await this.chat(messages);
  }
};