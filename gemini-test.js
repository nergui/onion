const {VertexAI} = require('@google-cloud/vertexai');

/**
 * TODO(developer): Update these variables before running the sample.
 */
async function generate_from_text_input(projectId = 'onion-genimi') {
  const vertexAI = new VertexAI({project: projectId, location: 'us-central1'});

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.0-pro-002',
  });

  const prompt =
    "What's a good name for a flower shop that specializes in selling bouquets of dried flowers?";

  const resp = await generativeModel.generateContent(prompt);
  const contentResponse = await resp.response;
  console.log(JSON.stringify(contentResponse));
}
generate_from_text_input()