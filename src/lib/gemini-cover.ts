const GEMINI_API_KEY = "AIzaSyCTtBRTMZel17KH3xxBLD4M5JSy3tMuYOo";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface CoverDesign {
  imagePrompt: string;
  colorScheme: string;
  style: string;
  typography: string;
}

export const generateCoverDesign = async (
  title: string,
  idea: string,
  genre: string,
  designRecommendations?: string
): Promise<CoverDesign> => {
  const prompt = `Create a detailed cover design prompt for a book with the following details:

Book Title: ${title}
Book Idea: ${idea}
Genre: ${genre}
Design Recommendations: ${designRecommendations || 'None specified'}

Please provide a detailed visual description for an AI image generator that would create an appropriate book cover. Include:
1. Main visual elements and composition
2. Color scheme
3. Style (modern, classic, artistic, etc.)
4. Typography recommendations

Format your response as JSON with this exact structure:
{
  "imagePrompt": "Detailed visual description for image generation",
  "colorScheme": "Primary and secondary colors",
  "style": "Overall design style",
  "typography": "Font and text recommendations"
}

Make the cover visually appealing and appropriate for the genre. The image prompt should be detailed enough for an AI to generate a compelling book cover image.`;

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
          maxOutputTokens: 1024,
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
    
    const coverDesign = JSON.parse(jsonMatch[0]);
    return coverDesign;
  } catch (error) {
    console.error('Gemini Cover API error:', error);
    throw new Error('Failed to generate cover design. Please try again.');
  }
};