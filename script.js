// Prompt strings for each button - easy to edit and customize
const prompts = {
  // Base system prompt - will be modified based on personality settings
  systemBase: "You are a helpful, friendly assistant that specializes in creating engaging conversation starters and social interactions. Keep your responses concise, upbeat, and appropriate for all audiences. Always aim to help people connect and have fun conversations.",
  
  icebreaker: "Generate a fun, casual icebreaker question that would be perfect for starting a conversation with someone new. Make it engaging and not too personal.",
  
  weirdFact: "Share an interesting and weird fact that most people don't know. Make it fascinating and conversation-worthy.",
  
  joke: "Tell me a clean, funny joke that would be appropriate for any audience. Make it clever and entertaining.",
  
  weather: "Give me a creative and fun way to start a conversation about the weather. Make it more interesting than just 'nice weather today'."
};

// Personality trait descriptions that modify the system prompt
const personalityTraits = {
  funny: "Be extra humorous, witty, and include clever wordplay or puns in your responses.",
  sassy: "Be bold, confident, and a little bit attitude-filled. Don't be afraid to be cheeky or throw some shade.",
  blunt: "Be completely honest and direct. Say things as they are without sugar-coating or beating around the bush.",
  dramatic: "Be over-the-top, theatrical, and melodramatic. Use lots of emphasis and make everything sound like a big deal.",
  nerdy: "Use geeky references, technical terms, and show enthusiasm for obscure knowledge and pop culture.",
  mysterious: "Be cryptic, enigmatic, and speak in riddles. Leave some things unexplained and create intrigue.",
  energetic: "Be enthusiastic, use exclamation points, and show high energy and excitement in your responses.",
  sarcastic: "Use dry humor, irony, and subtle mockery. Be witty in a slightly cynical way.",
  formal: "Use professional language, proper grammar, and maintain a respectful, business-like tone.",
  quirky: "Be wonderfully weird, embrace the absurd, and think in unconventional ways that surprise people.",
  casual: "Use informal language, contractions, and speak like you're chatting with a close friend.",
  philosophical: "Provide deeper, more reflective responses that encourage meaningful thinking and explore life's big questions.",
  creative: "Think outside the box, use unique metaphors, and approach topics from unexpected creative angles.",
  rebellious: "Challenge conventions, question authority, and suggest doing things differently. Be a little defiant.",
  cheerful: "Be annoyingly positive and upbeat about everything. Find the bright side even in mundane things."
};

// Fun loading messages to show while waiting for AI response
const loadingMessages = [
  '🤔 Thinking of something brilliant...',
  '🧠 Brain cells are working overtime...',
  '✨ Cooking up something amazing...',
  '🎭 Putting on my creative hat...',
  '🔮 Consulting the conversation crystal ball...',
  '🎪 Juggling words and ideas...',
  '🚀 Launching into creative mode...',
  '🎨 Painting the perfect response...',
  '🎲 Rolling the dice of creativity...',
  '🌟 Sprinkling some magic dust...',
  '🎯 Aiming for the perfect answer...',
  '🧩 Solving the conversation puzzle...',
  '⚡ Charging up the humor circuits...',
  '🎊 Preparing something fun...',
  '🍀 Finding the perfect words...'
];

// OpenAI API configuration
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Function to generate system prompt based on selected personality traits
function generateSystemPrompt() {
  // Start with the base system prompt
  let systemPrompt = prompts.systemBase;
  
  // Get all checked personality trait checkboxes
  const selectedTraits = [];
  Object.keys(personalityTraits).forEach(trait => {
    const checkbox = document.getElementById(trait);
    if (checkbox && checkbox.checked) {
      selectedTraits.push(personalityTraits[trait]);
    }
  });
  
  // Add personality modifications to the system prompt
  if (selectedTraits.length > 0) {
    systemPrompt += "\n\nAdditional personality instructions: " + selectedTraits.join(" ");
  }
  
  return systemPrompt;
}

// Function to call OpenAI API
async function callOpenAI(prompt) {
  // Show a random fun loading message to user
  const responseDiv = document.getElementById('response');
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  responseDiv.innerHTML = randomMessage;
  
  try {
    // Make API request to OpenAI
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using the specified model
        messages: [
          {
            role: 'system',
            content: generateSystemPrompt()  // Use dynamic system prompt based on personality settings
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.9  // Higher temperature for more creative responses
      })
    });

    // Check if the API request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    // Parse the response from OpenAI
    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Display the AI response to the user
    responseDiv.innerHTML = `💬 ${aiResponse}`;
    
  } catch (error) {
    // Handle any errors that occur
    console.error('Error calling OpenAI API:', error);
    responseDiv.innerHTML = '❌ Oops! Something went wrong. Please try again.';
  }
}

// Wait for the page to load before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
  
  // Get all the button elements by their IDs
  const icebreakerBtn = document.getElementById('iceBtn');
  const factBtn = document.getElementById('factBtn');
  const jokeBtn = document.getElementById('jokeBtn');
  const weatherBtn = document.getElementById('weatherBtn');
  
  // Add event listener for the Icebreaker button
  icebreakerBtn.addEventListener('click', function() {
    console.log('Icebreaker button clicked');
    callOpenAI(prompts.icebreaker);
  });
  
  // Add event listener for the Weird Fact button
  factBtn.addEventListener('click', function() {
    console.log('Weird Fact button clicked');
    callOpenAI(prompts.weirdFact);
  });
  
  // Add event listener for the Joke button
  jokeBtn.addEventListener('click', function() {
    console.log('Joke button clicked');
    callOpenAI(prompts.joke);
  });
  
  // Add event listener for the Weather button
  weatherBtn.addEventListener('click', function() {
    console.log('Weather button clicked');
    callOpenAI(prompts.weather);
  });
  
  console.log('All event listeners added successfully!');
});