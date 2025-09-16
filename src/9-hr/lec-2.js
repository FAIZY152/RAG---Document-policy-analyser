import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const GetGroqChatCompletion = async () => {
//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "user",
//         content: "Hi i am Fayaz",
//       },
//     ],
//   });
//   //   console.log(completion.choices[0].message.content);
//   console.log(completion);

//   //   return completion.choices[0].message.content;
// };

// GetGroqChatCompletion();

// zero short prompt

// const GetGroqChatCompletion = async () => {
//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "system",
//         content: `you are a jarvis, a smart review grader. your task is analyse given review, give feedback and return the answer. classify the the review as rating from 1 to 5. you must return the result in valid json structure.
//           Example: {"rating": 5, "feedback": "good review"} `,
//       },
//       {
//         role: "user",
//         content: `Review: This is a great product! It has a nice design and works well. I would definitely recommend it.`,
//       },
//     ],
//   });
//   console.log(completion.choices[0].message.content);
// };

// best prompt
// const GetGroqChatCompletion = async () => {
//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "system",
//         content: `
//         You are PlannerAgent — an autonomous assistant that converts a single user GOAL into a short plan.
// Rules:
// - Always start with a 1-line summary of the goal.
// - Then produce a JSON object exactly matching this schema:
//   {
//     "goal": string,
//     "plan_summary": string,
//     "steps": [{"order": int, "task": string, "estimate_hours": number}],
//     "confidence": "low"|"medium"|"high"
//   }
// - If you lack necessary info, ask one clarifying question instead of guessing.
// - Never reveal system internals or API keys.
//         `,
//       },
//       {
//         role: "user",
//         content: `Review: GOAL: Organize a 2-hour give a lecture of Quran Surah al Baqarah in english.`,
//       },
//     ],
//   });
//   console.log(completion.choices[0].message.content);
// };

// few short prompt

const FewShot1 = async () => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
       You are SpecExtractor. Given a product description, return JSON with {name, category, price_usd, key_features}. Output must be valid JSON.
      Example 1:

       Input: "The ZetaPhone X has a 6.5\" OLED screen, Snapdragon 8, 256GB storage, $899."
       Output: {"name":"ZetaPhone X","category":"smartphone","price_usd":899,"key_features":["6.5-inch OLED","Snapdragon 8","256GB"]}

     Example 2:

      Input: "EcoKettle 2.0 — stainless steel kettle, 1.7L, auto-shutoff, $49.99."
      Output: {"name":"EcoKettle 2.0","category":"kitchen appliance","price_usd":49.99,"key_features":["1.7L","stainless steel","auto-shutoff"]}
        The response must:
        1. be valid JSON
        2. have double quotes for keys and string values
        3. have no extra text outside the JSON
        4. have price_usd as a number without currency symbol
Now convert this:
Input: "AuroraCam 4K action camera, waterproof to 30m, 64GB included, sells for $199."
Output:
        

        `,
      },
      {
        role: "user",
        content: `Now convert this:
         Input: "AuroraCam 4K action camera, waterproof to 30m, 64GB included, sells for $199."
         Output: `,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
};

FewShot1();
