
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Ritual, ChatMessage, XP } from '../types';

// Per coding guidelines, the API key is assumed to be available in process.env.API_KEY.
// FIX: Per coding guidelines, removed non-null assertion '!' from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

export const clearChat = () => {
    chat = null;
};

const RITUAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggested_rituals: {
      type: Type.ARRAY,
      description: "A list of three simple, personalized rituals for the user.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The type of ritual: 'Body', 'Mind', or 'Soul'." },
          name: { type: Type.STRING, description: "A short, descriptive name for the ritual." },
          xp: { type: Type.INTEGER, description: "The experience points awarded for completion." },
        },
        required: ["type", "name", "xp"],
      },
    },
    lotus_quote: {
        type: Type.STRING,
        description: "A short, inspiring quote for the user."
    }
  },
  required: ["suggested_rituals", "lotus_quote"],
};


export const getDailyRituals = async (reflection: string, mood: string): Promise<{rituals: Ritual[], quote: string}> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A user is reflecting on their day. Their mood is '${mood}' and their reflection is: "${reflection}". Based on this, suggest 3 simple daily rituals (one for 'Body', one for 'Mind', one for 'Soul') to help them. Also provide a short, inspiring 'lotus_quote'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: RITUAL_SCHEMA,
            },
        });

        // FIX: Added .trim() to response text before parsing as JSON for robustness.
        const data = JSON.parse(response.text.trim());
        
        const rituals: Ritual[] = data.suggested_rituals.map((r: any, index: number) => ({
            id: `ai-${Date.now()}-${index}`,
            type: r.type.toLowerCase() as keyof XP,
            name: r.name,
            xp: r.xp,
            completed: false,
        }));

        return { rituals, quote: data.lotus_quote };

    } catch (error) {
        console.error("Error fetching daily rituals from Gemini:", error);
        // Fallback rituals
        return {
            rituals: [
                { id: 'fb1', type: 'soul', name: 'Deep Breathing', xp: 10, completed: false },
                { id: 'fb2', type: 'body', name: 'Quick Stretch', xp: 10, completed: false },
                { id: 'fb3', type: 'mind', name: 'Mindful Moment', xp: 10, completed: false },
            ],
            quote: "Every sunrise is an invitation to brighten someone's day."
        };
    }
};

export const getProgressInsight = async (rank: string, aura: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A user's progress rank is '${rank}' and their current 'Aura' (energy level) is ${aura} out of 100. Write a short, encouraging, one-sentence insight reflecting their current state. High aura means high energy/positivity, low aura suggests a need for rest or gentler activities. Example for high aura: 'Your Radiant Lotus aura shines brightly today—your focus is unbreakable.' Example for low aura: 'Your aura is gentle today, a sign to rest and recharge. Progress is not always a sprint.'`
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching progress insight from Gemini:", error);
        return "Your journey of growth continues, one step at a time.";
    }
};


export const getChatResponse = async (history: ChatMessage[], message: string): Promise<string> => {
    try {
        if (!chat) {
            chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are Lotus, an AI mentor for a self-growth app. Your tone is warm, firm, and supportive, not overly therapeutic. Use short, meaningful advice based on Stoic and growth mindset principles to guide the user in their reflections.",
                },
            });
        }
        
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error fetching chat response from Gemini:", error);
        return "I'm having a moment to reflect myself. Please try again in a bit.";
    }
};