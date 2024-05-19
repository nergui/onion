const OpenAI = require('openai').default;
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI();

async function main() {
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "write me an essay about how to develope mongolia" }],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}

main();