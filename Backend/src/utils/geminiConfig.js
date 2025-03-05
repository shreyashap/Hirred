import { GoogleGenerativeAI } from "@google/generative-ai";
import "../config.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
