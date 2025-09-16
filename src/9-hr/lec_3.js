// tool calling
import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ToolCall1 = async () => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "you are the smart personal assistant. who answer the asked questions",
      },
      {
        role: "user",
        content: "when was Iphone 17 launch?",
      },
    ],
  });
  console.log("Ans: ", completion.choices[0].message.content);
};

ToolCall1();
