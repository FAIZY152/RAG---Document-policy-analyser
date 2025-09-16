// tool calling
import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.WEB_SEARC_API });

const ToolCall1 = async () => {
  let message = [
    {
      role: "system",
      content: `You are a smart personal assistant. When users ask about current events or real-time information, use the webSearch function to get the latest data.`,
    },
    {
      role: "user",
      content:
        "Search for the latest iPhone 16 and iphone 17 release launch date and year information.",
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
    tool_choice: "auto",
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
  const res = await tvly.search(query, { maxResults: 3 });
  const finalRes = res.results.map((data) => data.content).join("\n\n");
  return finalRes;
};

ToolCall1();
