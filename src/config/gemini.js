import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Temperature 0.1 — why not 0? 
// Pure 0 can sometimes make AI too rigid and miss context
// 0.1 gives tiny flexibility while staying precise
export const getModel = (temperature = 0.1) => {
  return genAI.getGenerativeModel({
     model: "gemini-3-flash-preview",
    generationConfig: {
      maxOutputTokens: 3048,
      temperature,
    },
  });
};
