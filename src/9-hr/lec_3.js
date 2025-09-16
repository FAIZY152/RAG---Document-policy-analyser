// tool calling
import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import { json } from "express";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.WEB_SEARC_API });

const ToolCall1 = async () => {
  let message = [
    {
      role: "system",
      content: `You are a smart personal assistant. When users ask about current events, product launches, or information that requires real-time data, you should use the webSearch function to get the latest information.`,
    },
    {
      role: "user",
      content:
        "What are the latest verified statistics on casualties, including men, women, and children, in the ongoing Genocide between Israel and Palestine? Please provide sources for the information.",
    },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: message,
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
  //   add content to know llm your history
  message.push(completion.choices[0].message);

  let tools = completion.choices[0].message.tool_calls;
  if (!tools) {
    console.log(`Ans : ${completion.choices[0].message}`);
    return;
  }

  for (let tool of tools) {
    const functionName = tool.function.name;
    const functionArgs = JSON.parse(tool.function.arguments);
    if (functionName === "webSearch") {
      const toolRes = await webSearch(functionArgs);
      //   make tool result in Messages history
      message.push({
        tool_call_id: tool.id,
        role: "tool",
        name: functionName,
        content: toolRes,
      });
    }
  }

  //   call again to get final result
  const finalRes = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: message,

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
  console.log(
    `Final Ans : ${JSON.stringify(
      finalRes.choices[0].message.content,
      null,
      2
    )}`
  );
};

const webSearch = async ({ query }) => {
  //   const res = await tvly.search(query, { maxResults: 1 }); // search only one time
  const res = await tvly.search(query, { maxResults: 3 }); // by default it search 5 times
  const finalRes = res.results.map((data) => data.content);
  return finalRes;
};

ToolCall1();
