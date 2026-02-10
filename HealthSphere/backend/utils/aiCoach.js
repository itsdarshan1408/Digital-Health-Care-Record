// Intelligent AI Health Coach System
// Provides contextual, evidence-based health advice without external APIs

class AIHealthCoach {
  constructor() {
    this.conversationContext = new Map();
    this.healthKnowledge = this.initializeKnowledgeBase();
    this.responsePatterns = this.initializeResponsePatterns();
  }

  initializeKnowledgeBase() {
    return {
      nutrition: {
        keywords: ['food', 'eat', 'diet', 'meal', 'nutrition', 'calories', 'protein', 'carbs', 'fat', 'vitamin', 'mineral', 'hungry', 'snack', 'breakfast', 'lunch', 'dinner'],
        responses: {
          general: "Nutrition is the foundation of good health! Focus on whole, unprocessed foods, plenty of vegetables, lean proteins, and stay hydrated. What specific nutrition goals are you working on?",
          weight_loss: "For healthy weight management: Create a moderate calorie deficit, eat protein with each meal, fill half your plate with vegetables, and stay hydrated. Small, sustainable changes work best!",
          muscle_gain: "To support muscle growth: Eat adequate protein (0.8-1g per lb body weight), include complex carbs for energy, don't skip meals, and time protein intake around workouts.",
          energy: "For sustained energy: Eat balanced meals with protein, complex carbs, and healthy fats. Avoid sugar crashes by choosing whole grains, and don't skip breakfast!",
          hydration: "Aim for 8-10 glasses of water daily, more if you're active. Signs of good hydration: pale yellow urine, moist lips, and good energy levels."
        }
      },
      fitness: {
        keywords: ['exercise', 'workout', 'fitness', 'gym', 'run', 'walk', 'strength', 'cardio', 'muscle', 'training', 'sport', 'active', 'movement'],
        responses: {
          general: "Regular exercise is amazing for both physical and mental health! The key is finding activities you enjoy. What type of movement interests you most?",
          beginner: "Start with 20-30 minutes of walking daily, add bodyweight exercises 2-3x/week (squats, push-ups, planks), and gradually increase intensity. Listen to your body!",
          strength: "For strength training: Focus on compound movements (squats, deadlifts, push-ups), start with bodyweight, progress gradually, and allow 48h recovery between sessions.",
          cardio: "Great cardio options: brisk walking, cycling, swimming, dancing, or stairs. Aim for 150 minutes moderate activity weekly. Find what you enjoy!",
          motivation: "Stay motivated by setting small, achievable goals, tracking progress, finding a workout buddy, and celebrating victories. Consistency beats perfection!"
        }
      },
      sleep: {
        keywords: ['sleep', 'tired', 'rest', 'insomnia', 'bed', 'wake', 'dream', 'nap', 'fatigue', 'energy'],
        responses: {
          general: "Quality sleep is crucial for health, recovery, and mental clarity. Adults need 7-9 hours nightly. How's your current sleep routine?",
          quality: "For better sleep: Keep consistent bedtime, create a cool, dark room, limit screens 1h before bed, avoid caffeine after 2pm, and try relaxation techniques.",
          schedule: "Maintain a consistent sleep schedule, even on weekends. Your body loves routine! Go to bed and wake up at the same time daily.",
          environment: "Optimize your sleep environment: cool temperature (65-68°F), blackout curtains, comfortable mattress, and minimal noise. Your bedroom should be a sleep sanctuary."
        }
      },
      stress: {
        keywords: ['stress', 'anxiety', 'worried', 'overwhelmed', 'pressure', 'mental', 'mood', 'relax', 'calm', 'meditation'],
        responses: {
          general: "Stress management is vital for overall health. Everyone experiences stress, but we can learn healthy coping strategies. What's your biggest stress trigger?",
          techniques: "Try these stress-busters: deep breathing (4-7-8 technique), progressive muscle relaxation, short walks, journaling, or talking to someone you trust.",
          mindfulness: "Mindfulness helps: Try 5 minutes of deep breathing, notice 5 things you can see/hear/feel, or use guided meditation apps. Start small and build the habit.",
          physical: "Physical activity is a great stress reliever! Even 10 minutes of movement can help. Try yoga, walking, dancing, or any activity you enjoy."
        }
      },
      general_health: {
        keywords: ['health', 'wellness', 'doctor', 'symptoms', 'pain', 'sick', 'medicine', 'checkup', 'prevention'],
        responses: {
          general: "Your health is your greatest asset! Focus on the basics: nutritious food, regular movement, quality sleep, stress management, and regular check-ups.",
          prevention: "Prevention is key: Regular exercise, balanced nutrition, adequate sleep, stress management, staying hydrated, and routine health screenings.",
          symptoms: "For any concerning symptoms, please consult a healthcare professional. I can provide general wellness tips, but medical issues need proper evaluation."
        }
      }
    };
  }

  initializeResponsePatterns() {
    return {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
      questions: ['how', 'what', 'why', 'when', 'where', 'can you', 'should i', 'is it'],
      goals: ['goal', 'want to', 'trying to', 'hope to', 'plan to', 'need to'],
      problems: ['problem', 'issue', 'trouble', 'difficulty', 'struggle', 'hard', 'challenging']
    };
  }

  analyzeMessage(message, userId, conversationHistory = []) {
    const lowerMessage = message.toLowerCase();
    
    // Update conversation context
    this.updateContext(userId, message, conversationHistory);
    
    // Determine intent and category
    const intent = this.detectIntent(lowerMessage);
    const category = this.detectCategory(lowerMessage);
    const subcategory = this.detectSubcategory(lowerMessage, category);
    
    return { intent, category, subcategory };
  }

  updateContext(userId, message, history) {
    if (!this.conversationContext.has(userId)) {
      this.conversationContext.set(userId, {
        topics: [],
        goals: [],
        preferences: {},
        lastInteraction: new Date()
      });
    }
    
    const context = this.conversationContext.get(userId);
    
    // Extract topics from recent messages
    const recentTopics = this.extractTopics(message);
    context.topics = [...new Set([...context.topics, ...recentTopics])].slice(-5);
    
    // Extract goals
    const goals = this.extractGoals(message);
    if (goals.length > 0) {
      context.goals = [...new Set([...context.goals, ...goals])].slice(-3);
    }
    
    context.lastInteraction = new Date();
    this.conversationContext.set(userId, context);
  }

  detectIntent(message) {
    if (this.responsePatterns.greeting.some(g => message.includes(g))) return 'greeting';
    if (this.responsePatterns.thanks.some(t => message.includes(t))) return 'thanks';
    if (this.responsePatterns.questions.some(q => message.includes(q))) return 'question';
    if (this.responsePatterns.goals.some(g => message.includes(g))) return 'goal_setting';
    if (this.responsePatterns.problems.some(p => message.includes(p))) return 'problem_solving';
    return 'general';
  }

  detectCategory(message) {
    let maxScore = 0;
    let bestCategory = 'general_health';
    
    for (const [category, data] of Object.entries(this.healthKnowledge)) {
      const score = data.keywords.filter(keyword => message.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }
    
    return bestCategory;
  }

  detectSubcategory(message, category) {
    const categoryData = this.healthKnowledge[category];
    if (!categoryData) return 'general';
    
    // Specific subcategory detection based on keywords
    if (category === 'nutrition') {
      if (message.includes('weight') && (message.includes('lose') || message.includes('loss'))) return 'weight_loss';
      if (message.includes('muscle') || message.includes('gain') || message.includes('bulk')) return 'muscle_gain';
      if (message.includes('energy') || message.includes('tired') || message.includes('fatigue')) return 'energy';
      if (message.includes('water') || message.includes('hydrat')) return 'hydration';
    }
    
    if (category === 'fitness') {
      if (message.includes('beginner') || message.includes('start') || message.includes('new')) return 'beginner';
      if (message.includes('strength') || message.includes('weight') || message.includes('muscle')) return 'strength';
      if (message.includes('cardio') || message.includes('running') || message.includes('heart')) return 'cardio';
      if (message.includes('motivat') || message.includes('stick') || message.includes('consistent')) return 'motivation';
    }
    
    if (category === 'sleep') {
      if (message.includes('quality') || message.includes('better') || message.includes('deep')) return 'quality';
      if (message.includes('schedule') || message.includes('routine') || message.includes('time')) return 'schedule';
      if (message.includes('room') || message.includes('bed') || message.includes('environment')) return 'environment';
    }
    
    if (category === 'stress') {
      if (message.includes('technique') || message.includes('method') || message.includes('way')) return 'techniques';
      if (message.includes('mindful') || message.includes('meditat') || message.includes('breath')) return 'mindfulness';
      if (message.includes('exercise') || message.includes('physical') || message.includes('move')) return 'physical';
    }
    
    return 'general';
  }

  extractTopics(message) {
    const topics = [];
    for (const [category, data] of Object.entries(this.healthKnowledge)) {
      if (data.keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        topics.push(category);
      }
    }
    return topics;
  }

  extractGoals(message) {
    const goals = [];
    const goalPatterns = [
      /want to (.*?)(?:\.|$)/gi,
      /trying to (.*?)(?:\.|$)/gi,
      /goal.*?is (.*?)(?:\.|$)/gi,
      /hope to (.*?)(?:\.|$)/gi
    ];
    
    goalPatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        goals.push(...matches.map(match => match.replace(pattern, '$1').trim()));
      }
    });
    
    return goals;
  }

  generateResponse(message, userId, conversationHistory = []) {
    const analysis = this.analyzeMessage(message, userId, conversationHistory);
    const context = this.conversationContext.get(userId) || {};
    
    let response = this.getBaseResponse(analysis);
    
    // Add personalization based on context
    response = this.personalizeResponse(response, context, analysis);
    
    // Add follow-up questions
    response += '\n\n' + this.generateFollowUp(analysis, context);
    
    return response;
  }

  getBaseResponse(analysis) {
    const { category, subcategory } = analysis;
    const categoryData = this.healthKnowledge[category];
    
    if (categoryData && categoryData.responses[subcategory]) {
      return categoryData.responses[subcategory];
    }
    
    if (categoryData && categoryData.responses.general) {
      return categoryData.responses.general;
    }
    
    return this.healthKnowledge.general_health.responses.general;
  }

  personalizeResponse(response, context, analysis) {
    // Add context-aware personalization
    if (context.goals && context.goals.length > 0) {
      const relevantGoal = context.goals.find(goal => 
        goal.toLowerCase().includes(analysis.category) || 
        this.healthKnowledge[analysis.category]?.keywords.some(keyword => 
          goal.toLowerCase().includes(keyword)
        )
      );
      
      if (relevantGoal) {
        response += `\n\n💡 I remember you mentioned wanting to ${relevantGoal}. This advice should help with that goal!`;
      }
    }
    
    return response;
  }

  generateFollowUp(analysis, context) {
    const followUps = {
      nutrition: [
        "What's your biggest nutrition challenge right now?",
        "Do you track your meals or water intake?",
        "Any foods you're trying to include more of?"
      ],
      fitness: [
        "What activities do you enjoy most?",
        "How many days per week are you currently active?",
        "Any specific fitness goals you're working toward?"
      ],
      sleep: [
        "How many hours of sleep do you typically get?",
        "What's your current bedtime routine like?",
        "Any factors that commonly disrupt your sleep?"
      ],
      stress: [
        "What are your main sources of stress?",
        "Have you tried any relaxation techniques before?",
        "What helps you feel most calm and centered?"
      ]
    };
    
    const categoryFollowUps = followUps[analysis.category] || [
      "What's your main health focus right now?",
      "How can I best support your wellness journey?",
      "Any specific questions about your health goals?"
    ];
    
    return categoryFollowUps[Math.floor(Math.random() * categoryFollowUps.length)];
  }

  // Get conversation summary for user
  getConversationSummary(userId) {
    const context = this.conversationContext.get(userId);
    if (!context) return null;
    
    return {
      topics: context.topics,
      goals: context.goals,
      lastInteraction: context.lastInteraction
    };
  }
}

export default new AIHealthCoach();
