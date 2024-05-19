const axios = require('axios');

async function main() {
    const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions', // Corrected endpoint
        headers: {
            'Authorization': 'Bearer sk-onion-VZ6jTvi6JvDzv1eFogPPT3BlbkFJppfHJQWYtJbk7K269QPO',
            'Content-Type': 'application/json',
        },
        data: {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "write me an essay about how to develop Mongolia" }],
            stream: true,
        },
        responseType: 'stream'
    };

    console.log('Sending request with config:', config);

    try {
        const response = await axios(config);

        // Handling the stream
        response.data.on('data', (chunk) => {
            const chunkString = chunk.toString();
            const lines = chunkString.split('\n');
            for (let line of lines) {
                if (line.trim() !== '') {
                    if (line.startsWith('data: ')) {
                        line = line.slice(6); // Remove the 'data: ' prefix
                    }
                    try {
                        const parsedChunk = JSON.parse(line);
                        if (parsedChunk.choices && parsedChunk.choices[0] && parsedChunk.choices[0].delta) {
                            process.stdout.write(parsedChunk.choices[0].delta.content || "");
                        }
                    } catch (error) {
                        console.error('Failed to parse line:', line);
                    }
                }
            }
        });

        response.data.on('end', () => {
            console.log('Streaming completed.');
        });

    } catch (error) {
        console.error('Error streaming data from OpenAI:', error);
        console.log('Error details:', error.response?.data);
    }
}

main();
