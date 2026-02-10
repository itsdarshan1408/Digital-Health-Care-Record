import Message from '../models/Message.js';
import axios from 'axios';

// @desc    Send message to AI coach
// @route   POST /api/ai/coach
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Get conversation history
    const history = await Message.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);

    let aiResponse;
    let structuredResponse = {
      goals: [],
      meals: [],
      exercises: [],
      followUpQuestions: [],
    };

    // Check if OpenAI API key exists
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
      try {
        // Call OpenAI API
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a supportive health and wellness coach. Provide general wellness guidance based on evidence-based practices. 
                
                IMPORTANT GUIDELINES:
                - Do NOT give medical diagnoses or emergency advice
                - Always recommend consulting a healthcare professional for serious concerns
                - Focus on lifestyle, nutrition, exercise, and mental wellness
                - Be encouraging and supportive
                - Provide actionable suggestions
                
                When responding, include:
                1. Practical health goals
                2. Meal suggestions if relevant
                3. Exercise recommendations if relevant
                4. Follow-up questions to better understand their needs`
              },
              ...history.reverse().map(msg => ([
                { role: 'user', content: msg.message },
                { role: 'assistant', content: msg.aiResponse },
              ])).flat(),
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        aiResponse = response.data.choices[0].message.content;

        // Parse structured response (basic implementation)
        if (aiResponse.toLowerCase().includes('goal')) {
          structuredResponse.goals = ['Stay active', 'Eat balanced meals', 'Get adequate sleep'];
        }
        if (aiResponse.toLowerCase().includes('meal') || aiResponse.toLowerCase().includes('food')) {
          structuredResponse.meals = ['Include more vegetables', 'Choose whole grains', 'Stay hydrated'];
        }
        if (aiResponse.toLowerCase().includes('exercise') || aiResponse.toLowerCase().includes('workout')) {
          structuredResponse.exercises = ['30 minutes daily walk', 'Stretching exercises', 'Strength training twice a week'];
        }
        structuredResponse.followUpQuestions = ['How is your sleep quality?', 'Do you track your meals?', 'What activities do you enjoy?'];

      } catch (apiError) {
        console.error('OpenAI API Error:', apiError.response?.data || apiError.message);
        // Fallback to default response
        aiResponse = generateFallbackResponse(message);
      }
    } else {
      // Fallback response when no API key
      aiResponse = generateFallbackResponse(message);
    }

    // Save message to database
    const savedMessage = await Message.create({
      userId,
      message,
      aiResponse,
      structuredResponse,
    });

    res.json({
      reply: aiResponse,
      structured_response: structuredResponse,
      messageId: savedMessage._id,
    });
  } catch (error) {
    console.error('Coaching controller error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/ai/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/ai/history
// @access  Private
export const clearChatHistory = async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.user._id });
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fallback response generator
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('meal')) {
    return `Great question about nutrition! Here are some general wellness tips:

🥗 Focus on whole, unprocessed foods
🍎 Include plenty of fruits and vegetables
💧 Stay hydrated throughout the day
🍽️ Practice mindful eating and portion control

For personalized dietary advice, I recommend consulting with a registered dietitian or nutritionist.

What specific nutrition goals are you working towards?`;
  }
  
  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
    return `Exercise is wonderful for overall health! Here are some evidence-based recommendations:

🚶‍♂️ Aim for 150 minutes of moderate activity per week
💪 Include strength training 2-3 times weekly
🧘‍♀️ Don't forget flexibility and balance exercises
😴 Allow adequate rest and recovery

Always start gradually and listen to your body. If you have any health concerns, consult your doctor before starting a new exercise program.

What types of physical activities do you enjoy?`;
  }
  
  if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('rest')) {
    return `Sleep is crucial for health and wellness! Here are some tips:

😴 Aim for 7-9 hours per night
📱 Limit screen time before bed
🌡️ Keep your bedroom cool and dark
⏰ Maintain a consistent sleep schedule

If you're experiencing persistent sleep issues, please consult a healthcare provider.

How many hours of sleep are you currently getting?`;
  }
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('mental')) {
    return `Mental wellness is just as important as physical health! Here are some strategies:

🧘‍♂️ Practice mindfulness or meditation
🌳 Spend time in nature
👥 Connect with supportive friends and family
📝 Try journaling your thoughts

If you're experiencing significant mental health challenges, please reach out to a mental health professional.

What stress management techniques have you tried?`;
  }
  
  return `Thank you for reaching out! I'm here to provide general wellness guidance.

As your health coach, I can help with:
✅ Fitness and exercise planning
✅ Nutrition and meal guidance
✅ Sleep and recovery tips
✅ Stress management strategies
✅ Overall wellness goals

Remember: I provide general wellness advice, not medical diagnoses. For specific health concerns, always consult with a healthcare professional.

How can I support your wellness journey today?`;
}
