
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthAnalysis = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a preliminary health check for these symptoms: ${symptoms}. 
      Return the analysis in a helpful, supportive tone. 
      IMPORTANT: Include a clear medical disclaimer that this is not professional medical advice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of possible common conditions"
            },
            recommendation: {
              type: Type.STRING,
              description: "Short immediate action to take"
            },
            urgency: {
              type: Type.STRING,
              description: "How urgent it is to see a doctor (Low, Medium, High)"
            },
            disclaimer: {
              type: Type.STRING,
              description: "Standard medical disclaimer"
            }
          },
          required: ["possibleCauses", "recommendation", "urgency", "disclaimer"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getMoodAnalysis = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following patient's voice transcript and determine their emotional state and stress level: "${text}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            stressLevel: { type: Type.STRING, description: "Scale of 1-10" },
            advice: { type: Type.STRING }
          },
          required: ["mood", "stressLevel", "advice"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Mood Analysis Error:", error);
    return null;
  }
};
