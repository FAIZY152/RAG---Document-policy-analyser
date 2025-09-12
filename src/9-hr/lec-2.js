import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GetGroqChatCompletion = async () => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Hi i am Fayaz",
      },
    ],
  });
  //   console.log(completion.choices[0].message.content);
  console.log(completion);

  //   return completion.choices[0].message.content;
};

GetGroqChatCompletion();
