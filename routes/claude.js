const Anthropic = require('@anthropic-ai/sdk');

/**
 * Handles a chat session using Anthropic's Claude model.
 *
 * @param {string} model - The model ID to use for generating chat responses.
 * @param {string} prompt - User's input text to start the chat.
 * @param {Object} res - The Express response object to send responses back to the client.
 * @param {Function} callback - Callback to execute after response handling, signaling operation completion.
 */
async function createClaudeStreamChat(model, prompt, res, callback) {
  const selectedModel = model || 'claude-3-opus-20240229';
  console.log("Using model: " + selectedModel);
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY  // Ensure the API key is set in your environment variables
  });

  try {
    const msg = await anthropic.messages.create({
      model: selectedModel,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    });

    if (msg && msg.content && msg.content.length > 0) {
      msg.content.forEach(part => {
        if (part.type === 'text' && part.text) {
          console.log("Claude: " + part.text);
          res.write(part.text);
        }
      });
      res.end();  // End the response after sending all messages
      callback(true);  // Signal successful operation completion
    } else {
      console.error('No content found in the response:', msg);
      res.status(500).send('No content available to display.');
      callback(false);
    }
  } catch (error) {
    console.error("Error during chat session with Claude:", error);
    res.status(500).send('Failed to generate content due to server error.');
    callback(false);
  }
}
module.exports = createClaudeStreamChat;