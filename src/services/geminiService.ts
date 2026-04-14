import { GoogleGenAI } from "@google/genai";

export async function generateContent<T>(prompt: string, text?: string, type?: string): Promise<T> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  let fullPrompt = prompt;
  if (text) {
    fullPrompt = `Source Text:\n${text}\n\nTask:\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: fullPrompt,
    config: {
      systemInstruction: "You are an expert educational AI assistant. Always return valid JSON.",
      responseMimeType: "application/json",
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  try {
    return JSON.parse(response.text) as T;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("Invalid JSON response from AI");
  }
}
