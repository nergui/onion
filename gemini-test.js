const {VertexAI} = require('@google-cloud/vertexai');



console.log("hello world");
/**
 * TODO(developer): Update these variables before running the sample.
 */
async function createStreamChat(
  projectId = 'onion-genimi',
  location = 'us-central1',
  model = 'gemini-1.5-flash-001'
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({project: projectId, location: location});

  // Instantiate the model
  const generativeModel = vertexAI.getGenerativeModel({
    model: model,
  });

  const chat = generativeModel.startChat({});
  const chatInput1 = 'How can I learn more about that?';

  console.log(`User: ${chatInput1}`);

  try {
    const result1 = await chat.sendMessageStream(chatInput1);
    for await (const item of result1.stream) {
      console.log(item.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error("Error during chat session:", error);
  }
   
}

createStreamChat();