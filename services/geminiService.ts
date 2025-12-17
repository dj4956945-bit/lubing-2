import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, TimelineEvent } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Chat with the AI History Tutor
 */
export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "你是一位博学、客观且充满热情的中国共产党党史专家。请用简洁、生动且准确的中文回答用户关于党史的问题。如果涉及具体数据或日期，请尽量精确。保持尊重的语调。",
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("无法连接到历史知识库，请稍后再试。");
  }
};

/**
 * Generate Quiz Questions
 */
export const generateQuizQuestions = async (topic: string = "general"): Promise<QuizQuestion[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        correctOptionIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
        explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" },
      },
      required: ["id", "question", "options", "correctOptionIndex", "explanation"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `生成5道关于中国共产党党史的单选题。题目难度适中，覆盖不同历史时期（如建党、长征、抗日战争、改革开放等）。
      返回纯JSON格式。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    // Fallback data in case of API failure for demo stability
    return [
      {
        id: 1,
        question: "中国共产党诞生的时间是？",
        options: ["1919年", "1921年", "1927年", "1949年"],
        correctOptionIndex: 1,
        explanation: "1921年7月23日，中国共产党第一次全国代表大会在上海召开，标志着中国共产党的正式成立。"
      }
    ];
  }
};

/**
 * Generate Timeline Events
 */
export const generateTimelineEvents = async (era: string = "all"): Promise<TimelineEvent[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        year: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        significance: { type: Type.STRING },
      },
      required: ["year", "title", "description", "significance"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `生成8个中国共产党历史上的关键里程碑事件，按时间顺序排列。包含从建党到新时代的代表性事件。确保年份准确。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as TimelineEvent[];
  } catch (error) {
    console.error("Timeline Gen Error:", error);
    return [];
  }
};