const { VertexAI } = require('@google-cloud/vertexai');

/**
 * Initializes and starts a chat session using Google Cloud's Vertex AI, responding to an HTTP request.
 * 
 * @param {string} model - The ID of the model to be used for the chat.
 * @param {string} prompt - Input text from the user to start the chat.
 * @param {Object} res - The Express response object to send data back to the client.
 */
async function createGeminiStreamChat(model, prompt, res) {
    const projectId = 'onion-genimi';  // Your Google Cloud Project ID
    const location = 'us-central1';    // The location for the Vertex AI resources

    // Initialize Vertex AI with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });
    const selectedModel = model || 'gemini-1.0-pro-002'
    console.log("Using model:" + selectedModel);
    // Instantiate the model
    const generativeModel = vertexAI.getGenerativeModel({ model: selectedModel });


    try {
        const chat = generativeModel.startChat({}); // Assuming startChat exists and works as described
        const result1 = await chat.sendMessageStream(prompt);
        for await (const item of result1.stream) {
            // Assuming the stream provides data as expected
            console.log("Gemini: " + item.candidates[0].content.parts[0].text);
            res.write(item.candidates[0].content.parts[0].text);
        }
        res.end();  // Close the response stream after all messages are sent
    } catch (error) {
        console.error("Error during chat session:", error);
        res.status(500).send('Failed to generate content due to server error.');
    }
}

module.exports = createGeminiStreamChat;
