import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const getCoachResponse = async (
  message: string, 
  context: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please set REACT_APP_GEMINI_API_KEY.";
  }

  try {
    const ai = getClient();
    const systemInstruction = `You are a "Street Team Coach" for a Bitcoin adoption campaign. 
    Your goal is to help young volunteers recruit other youth and onboard merchants to accept Bitcoin.
    
    The strategy focuses on building trust through human connection.
    Key principles:
    1. Be respectful and patient.
    2. Focus on solving payment challenges (e.g., M-Pesa fees, speed).
    3. Use "Sats" (Satoshis) to make it feel accessible.
    4. Provide practical, short scripts.
    
    Current Context: ${context}
    
    Keep answers concise, motivating, and actionable. If asked about technical details, explain simply using analogies suitable for non-technical merchants.`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response. Try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the network. Please check your connection.";
  }
};
