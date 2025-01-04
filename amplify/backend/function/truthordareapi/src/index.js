const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION
});

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dev.doo7bmargaewz.amplifyapp.com'
];

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const origin = event.headers.origin || event.headers.Origin || '';
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const headers = {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { type, category } = body;

        const prompt = `Generate exactly one ${type} question for a truth or dare game in the category "${category}".

            Rules:
            - If type is "truth": Create a single specific personal question that:
            * Must be answerable with personal experience
            * Must be appropriate for all ages
            * Must be fun and engaging
            * Must end with a question mark
            * Must not be hypothetical

            - If type is "dare": Create a single specific physical action that:
            * Must be immediately doable in any setting
            * Must be safe and appropriate for all ages
            * Must be clear and actionable
            * Must start with a verb
            * Must not require special equipment

            Format: Return only and direct question or dare statement without any additional text, category, explanation, or formatting.`;


        // Mistral Small specific payload format
        const payload = {
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.7,
            top_p: 0.9
        };

        const command = new InvokeModelCommand({
            modelId: "mistral.mistral-large-2402-v1:0",
            body: JSON.stringify(payload),
            contentType: "application/json",
            accept: "application/json",
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Extract the question from Mistral's response
        let question = responseBody.outputs[0].text.trim();
        question = question.match(/"([^"]*)"/) ? question.match(/"([^"]*)"/).pop() : question;
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                question: question
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate question',
                details: error.message
            })
        };
    }
};
