const { VertexAI } = require('@google-cloud/vertexai');

/**
 * Generates content based on a text prompt using VertexAI's generative model and sends only the extracted text back to the client.
 * 
 * @param {string} modelId The ID of the generative model to use.
 * @param {string} prompt The text prompt for content generation.
 * @param {Object} res The Express response object.
 */
async function generateFromTextInput(modelId, prompt, res) {
    const projectId = 'onion-genimi'; // Corrected project ID for consistency
    const vertexAI = new VertexAI({project: projectId, location: 'us-central1'});

    const generativeModel = vertexAI.getGenerativeModel({
        model: modelId,
    });

    try {
        const resp = await generativeModel.generateContent(prompt);
        const contentResponse = await resp.response;
        console.log("Response from model:", JSON.stringify(contentResponse));

        // Extract the text parts from the content
        const extractedContent = contentResponse.candidates.map(candidate => 
            candidate.content.parts.map(part => part.text).join('\n')
        ).join('\n');

        // Send the extracted text back to the client
        res.json({ content: extractedContent });
    } catch (error) {
        console.error("Error in generating content:", error);
        res.status(500).json({ error: "Failed to generate content" }); // Send an error response
    }
}

module.exports = generateFromTextInput;
