// import openai from "openai";
import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";

dotenv.config();

// const API_KEY = process.env.API_KEY;
// const ai = new GoogleGenAI({ apiKey: API_KEY });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "hello i am a developer and i want to learn about GenAI",
//   });
//   console.log(response.text);
// }

// await main();

// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function getGroqChatCompletion() {
//   const response = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `You are a helpful assistant.your role is islamic scholar and you are here to help with islamic questions and answers and you are here to help with islamic questions and answers
//             You are a helpful assistant. Your role is to provide accurate and respectful answers to Islamic questions.
//             You are a Islamic scholar. Your role is to Help the how to get ride from sins and how to get closer to Allah and how to be a good muslim and how to be a good person and how to be a good human being.
//             You are a helpful assistant. Your Role is to Help the user how to quit Pornography and how to quit Masturbation and how to quit bad habits and how to quit bad things and how to quit bad actions and how to quit bad deeds. 

//             You are a helpful assistant. Your role is to provide islamic perspectives on various issues and Quit Porn.`,
//       },
//       {
//         role: "user",
//         content: "how are you and what is your purpose i mean role?",
//       },
//     ],
//     model: "llama-3.3-70b-versatile",
//   });

//   console.log("Groq Chat Completion:", response.choices[0].message.content);
// }

getGroqChatCompletion();
