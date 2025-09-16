// tool calling
import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import { json } from "express";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.WEB_SEARC_API });

const ToolCall1 = async () => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant. You must use the available tools to answer questions that require real-time or latest information. Always use webSearch for questions about current events, product launches, or recent information.`,
      },
      {
        role: "user",
        content: "when was Iphone 17 launch?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Your purpose is search the latest information and real time data from the internet.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search to perfome search on the internet.",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "required",
  });
  //   console.log("Ans: ", completion.choices[0].message.tool_calls);

  let tools = completion.choices[0].message.tool_calls;
  //   console.log("Tools", tools);

  if (!tools) {
    console.log(`Ans : ${completion.choices[0].message}`);
    return;
  }

  for (let tool of tools) {
    const functionName = tool.function.name;
    const functionArgs = JSON.parse(tool.function.arguments);
    if (functionName === "webSearch") {
      const toolRes = await webSearch(functionArgs);
      console.log("Result", toolRes);
    }
  }
};

const webSearch = async ({ query }) => {
  const res = await tvly.search({ query });
  console.log("Result", JSON.stringify(res));
  return `Searched result for ${query}`;
};

ToolCall1();
