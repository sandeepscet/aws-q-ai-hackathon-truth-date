import { Amplify } from 'aws-amplify';
import config from '../aws-exports';

Amplify.configure(config);

// Get the API endpoint from aws-exports.js
const API_ENDPOINT = config.aws_cloud_logic_custom.find(
  api => api.name === 'truthordareapi'
).endpoint;

export async function generateQuestion(type, category) {
  try {
    console.log('Calling API endpoint:', `${API_ENDPOINT}/generate-question`);

    const response = await fetch(`${API_ENDPOINT}/generate-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        category,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    return data.question;
  } catch (error) {
    console.error("Error generating question:", error);
    return null;
  }
}
