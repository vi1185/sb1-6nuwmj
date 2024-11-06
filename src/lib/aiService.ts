import { HfInference } from '@huggingface/inference';

const client = new HfInference("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");

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
}

const systemPrompt = `You are a career roadmap generator. Generate a structured learning path as a valid JSON array.
Each node in the array must follow this exact format:
{
  "id": "unique-string-id",
  "title": "Step Title",
  "description": "Clear description of this career step",
  "skills": ["skill1", "skill2", "skill3"],
  "resources": ["resource1", "resource2", "resource3"]
}
Ensure the response is ONLY the JSON array with no additional text.`;

export const generateRoadmap = async (userInput: string): Promise<RoadmapNode[]> => {
  const prompt = `${systemPrompt}

Create a detailed AI career roadmap for this goal: ${userInput}

Include 4-6 major steps that build upon each other. For each step provide:
- A clear title describing the stage
- A concise description of what to learn
- 3-5 specific skills to acquire
- 2-3 concrete learning resources (courses, books, etc)`;

  try {
    let response = "";
    
    const stream = await client.chatCompletionStream({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        response += chunk.choices[0].delta.content || '';
      }
    }

    // Clean the response to ensure it only contains the JSON array
    response = response.trim();
    if (!response.startsWith('[')) {
      response = response.substring(response.indexOf('['));
    }
    if (!response.endsWith(']')) {
      response = response.substring(0, response.lastIndexOf(']') + 1);
    }

    try {
      const parsedResponse = JSON.parse(response) as RoadmapNode[];
      
      // Validate the response structure
      if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
        throw new Error('Invalid response format');
      }

      // Validate each node has required fields
      parsedResponse.forEach((node, index) => {
        if (!node.id || !node.title || !node.description || !Array.isArray(node.skills) || !Array.isArray(node.resources)) {
          throw new Error(`Invalid node format at index ${index}`);
        }
      });

      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, create a fallback response
      return [
        {
          id: 'error-1',
          title: 'Error Generating Roadmap',
          description: 'We encountered an issue while generating your roadmap. Please try again with a more specific career goal.',
          skills: ['Please try again'],
          resources: ['Refresh the page and try a new query']
        }
      ];
    }
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap. Please try again.');
  }
};