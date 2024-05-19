const axios = require('axios');

async function streamOpenAI(prompt, res) {
    const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Authorization': `Bearer sk-onion-VZ6jTvi6JvDzv1eFogPPT3BlbkFJppfHJQWYtJbk7K269QPO`,
            'Content-Type': 'application/json',
        },
        data: {
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            stream: true,
        },
        responseType: 'stream'
    };

    try {
        const response = await axios(config);

        let buffer = ''; // Buffer to accumulate incomplete chunks

        response.data.on('data', (chunk) => {
            buffer += chunk.toString();
            let boundary = buffer.indexOf('\n');

            while (boundary !== -1) {
                let completeMessage = buffer.slice(0, boundary).trim();
                buffer = buffer.slice(boundary + 1);

                if (completeMessage.startsWith('data: ')) {
                    completeMessage = completeMessage.slice(6); // Remove 'data: ' prefix
                }

                if (completeMessage) {
                    try {
                        const parsedChunk = JSON.parse(completeMessage);
                        if (parsedChunk.choices && parsedChunk.choices[0] && parsedChunk.choices[0].delta) {
                            res.write(parsedChunk.choices[0].delta.content || "");
                        }
                    } catch (error) {
                        console.error('Failed to parse line:', completeMessage);
                    }
                }

                boundary = buffer.indexOf('\n');
            }
        });

        response.data.on('end', () => {
            res.end();
        });

    } catch (error) {
        console.error('Error streaming data from OpenAI:', error);
        res.status(500).send('Error interacting with OpenAI: ' + error.message);
    }
}

module.exports = { streamOpenAI };
