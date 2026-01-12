import { groqAPI } from './groq';

export const generateQuizFromText = async (text, numQuestions = 10) => {
  try {
    // Clean text
    const cleanText = text.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (cleanText.length < 50) {
      throw new Error('Insufficient text content');
    }

    const questions = [];
    let attempts = 0;
    const maxAttempts = numQuestions * 2;
    const textChunk = cleanText.substring(0, 2000);
    
    while (questions.length < numQuestions && attempts < maxAttempts) {
      attempts++;
      
      try {
        const response = await groqAPI.chat([
          {
            role: 'system',
            content: 'Create ONE multiple choice question based on the provided text. Respond with: QUESTION: [question text] | A: [option] | B: [option] | C: [option] | D: [option] | CORRECT: [A/B/C/D] | EXPLANATION: [explanation]'
          },
          {
            role: 'user',
            content: `Create question ${questions.length + 1} from this text: ${textChunk}`
          }
        ], 'llama-3.1-8b-instant');

        const question = parseSimpleResponse(response);
        if (question) {
          questions.push(question);
        } else {
          // Create fallback question using text content
          const words = textChunk.split(/\s+/).filter(w => w.length > 3);
          const randomWords = words.slice(questions.length * 4, (questions.length + 1) * 4);
          questions.push({
            question: `Based on the content, what concept is mentioned?`,
            options: randomWords.length >= 4 ? randomWords : ["Concept A", "Concept B", "Concept C", "Concept D"],
            correct: 0,
            explanation: "This question is based on your uploaded content."
          });
        }
      } catch (error) {
        console.error(`Error generating question ${questions.length + 1}:`, error);
        // Add fallback question
        questions.push({
          question: `Question ${questions.length + 1} based on the uploaded content`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "This question is based on your uploaded file."
        });
      }
    }

    // Ensure we have exactly the requested number
    while (questions.length < numQuestions) {
      questions.push({
        question: `Question ${questions.length + 1} from uploaded content`,
        options: ["Answer A", "Answer B", "Answer C", "Answer D"],
        correct: 0,
        explanation: "This question is based on your uploaded content."
      });
    }

    return questions.slice(0, numQuestions);
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    return createFallbackQuestions(numQuestions, text);
  }
};

export const generateQuizFromTopic = async (topic, numQuestions = 10) => {
  try {
    const questions = [];
    let attempts = 0;
    const maxAttempts = numQuestions * 2; // Allow more attempts than needed
    
    while (questions.length < numQuestions && attempts < maxAttempts) {
      attempts++;
      
      try {
        const response = await groqAPI.chat([
          {
            role: 'system',
            content: 'Create ONE multiple choice question about the given topic. Respond with: QUESTION: [question text] | A: [option] | B: [option] | C: [option] | D: [option] | CORRECT: [A/B/C/D] | EXPLANATION: [explanation]'
          },
          {
            role: 'user',
            content: `Create question ${questions.length + 1} about: ${topic}`
          }
        ], 'llama-3.1-8b-instant');

        const question = parseSimpleResponse(response);
        if (question) {
          questions.push(question);
        } else {
          // If parsing fails, create a basic question
          questions.push({
            question: `What is an important aspect of ${topic}?`,
            options: [`Key concept of ${topic}`, "Alternative concept", "Different approach", "Other method"],
            correct: 0,
            explanation: `This relates to fundamental concepts in ${topic}.`
          });
        }
      } catch (error) {
        console.error(`Error generating question ${questions.length + 1}:`, error);
        // Add a fallback question on error
        questions.push({
          question: `What is a fundamental principle in ${topic}?`,
          options: [`Core principle of ${topic}`, "Secondary concept", "Related topic", "Alternative view"],
          correct: 0,
          explanation: `This question covers basic concepts in ${topic}.`
        });
      }
    }

    // Ensure we have exactly the requested number of questions
    while (questions.length < numQuestions) {
      questions.push({
        question: `What is question ${questions.length + 1} about ${topic}?`,
        options: [`Answer about ${topic}`, "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: `This is question ${questions.length + 1} about ${topic}.`
      });
    }

    return questions.slice(0, numQuestions);
    
  } catch (error) {
    console.error('Topic quiz generation error:', error);
    // Return the exact number of fallback questions requested
    return Array.from({ length: numQuestions }, (_, i) => ({
      question: `Question ${i + 1}: What is a key concept in ${topic}?`,
      options: [`Concept ${i + 1} about ${topic}`, "Alternative concept", "Different approach", "Other method"],
      correct: 0,
      explanation: `This is question ${i + 1} about ${topic}.`
    }));
  }
};

const parseSimpleResponse = (response) => {
  try {
    const parts = response.split('|').map(part => part.trim());
    
    let question = '';
    let options = ['', '', '', ''];
    let correct = 0;
    let explanation = '';
    
    parts.forEach(part => {
      if (part.startsWith('QUESTION:')) {
        question = part.replace('QUESTION:', '').trim();
      } else if (part.startsWith('A:')) {
        options[0] = part.replace('A:', '').trim();
      } else if (part.startsWith('B:')) {
        options[1] = part.replace('B:', '').trim();
      } else if (part.startsWith('C:')) {
        options[2] = part.replace('C:', '').trim();
      } else if (part.startsWith('D:')) {
        options[3] = part.replace('D:', '').trim();
      } else if (part.startsWith('CORRECT:')) {
        const correctLetter = part.replace('CORRECT:', '').trim().toUpperCase();
        correct = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
        if (correct === -1) correct = 0;
      } else if (part.startsWith('EXPLANATION:')) {
        explanation = part.replace('EXPLANATION:', '').trim();
      }
    });
    
    if (question && options.every(opt => opt)) {
      return { question, options, correct, explanation };
    }
    
    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
};

const createFallbackQuestions = (numQuestions, text) => {
  const words = text.split(/\s+/).filter(word => word.length > 3);
  const uniqueWords = [...new Set(words)].slice(0, numQuestions * 4);
  
  return Array.from({ length: numQuestions }, (_, i) => {
    const startIndex = i * 4;
    return {
      question: `Based on the content, what concept is mentioned${uniqueWords[startIndex] ? ` related to "${uniqueWords[startIndex]}"` : ''}?`,
      options: [
        uniqueWords[startIndex] || "Option A",
        uniqueWords[startIndex + 1] || "Option B",
        uniqueWords[startIndex + 2] || "Option C",
        uniqueWords[startIndex + 3] || "Option D"
      ],
      correct: 0,
      explanation: "This question is based on your uploaded content."
    };
  });
};

export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        
        // Clean text
        text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();
        
        if (text.length < 50) {
          reject(new Error('Could not extract readable text from this file. Please try a plain text file.'));
        } else {
          resolve(text);
        }
        
      } catch (error) {
        reject(new Error('Error processing file: ' + error.message));
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file, 'UTF-8');
  });
};