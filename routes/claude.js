const Anthropic = require('@anthropic-ai/sdk');

/**
 * Initializes and handles a chat session using Anthropic's Claude model.
 *
 * @param {string} model - The model ID to use for generating chat responses.
 * @param {string} prompt - User's input text to start the chat.
 * @param {Object} res - The Express response object to send responses back to the client.
 */
async function createClaudeStreamChat(model, prompt, res) {
  const selectedModel = model || 'claude-3-opus-20240229'
  console.log("Using model:" + selectedModel);
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY  // Use the API key from environment variables
  });

  try {
    const msg = await anthropic.messages.create({
      model: selectedModel,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    });

    // Check if the message content array exists and has elements
    if (msg && msg.content && Array.isArray(msg.content)) {
      msg.content.forEach(part => {
        if (part.type === 'text') {
          console.log("Cloude:" + part.text);  // Log the text content
          res.write(part.text);    // Send text content back to the client
        }
      });
      res.end();  // Close the response after sending all messages
    } else {
      console.error('No content found in the response:', msg);
      res.status(500).send('No content available to display.');
    }
  } catch (error) {
    console.error("Error during chat session:", error);
    res.status(500).send('Failed to generate content due to server error.');
  }
}

module.exports = createClaudeStreamChat;
