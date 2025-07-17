const GEMINI_API_KEY = "AIzaSyCTtBRTMZel17KH3xxBLD4M5JSy3tMuYOo";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface BookContent {
  outline: string[];
  chapters: {
    title: string;
    content: string;
  }[];
}

export const generateBookContent = async (
  idea: string, 
  audience: string, 
  genre: string,
  language?: string
): Promise<BookContent> => {
  const prompt = `Create a comprehensive book based on the following details:

Book Idea: ${idea}
Target Audience: ${audience}
Genre: ${genre}
Language: ${language || 'English'}

Please provide:
1. A detailed outline with 6-8 chapter titles
2. Full content for each chapter (at least 500 words per chapter)

IMPORTANT: Write the entire book content in ${language || 'English'} language. Ensure all text, chapter titles, and content are written in ${language || 'English'}.

Format your response as JSON with this exact structure:
{
  "outline": ["Chapter 1: Title", "Chapter 2: Title", ...],
  "chapters": [
    {
      "title": "Chapter 1: Title",
      "content": "Full chapter content here..."
    },
    ...
  ]
}

Make sure the content is engaging, well-structured, and tailored to the target audience. Each chapter should build upon the previous one and provide real value to readers.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const bookContent = JSON.parse(jsonMatch[0]);
    return bookContent;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate book content. Please try again.');
  }
};