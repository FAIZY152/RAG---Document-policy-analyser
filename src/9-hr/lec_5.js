// ==============================
//  Tool Calling with Groq + Tavily
// ==============================

// 1. Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// 2. Import required libraries
import Groq from "groq-sdk"; // For Groq LLM API
import { tavily } from "@tavily/core"; // For real-time web search

// 3. Initialize clients with API keys from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.WEB_SEARC_API });

/**
 * Main function to demonstrate tool calling
 */
const ToolCall1 = async () => {
  // -------------------------------
  // Initial Conversation Setup
  // -------------------------------
  let message = [
    {
      role: "system",
      content: `You are a smart personal assistant. 
      When users ask about current events or real-time information, 
      use the webSearch function to get the latest data.`,
    },
    {
      role: "user",
      content: "Search the current weather in Pakistan, Peshawar",
    },
  ];

  // Infinite loop to handle tool calling until completion
  while (true) {
    // -----------------------------------------
    // Step 1: Ask Groq LLM for next action
    // -----------------------------------------
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Groq LLM model
      temperature: 0, // Deterministic response
      messages: message, // Conversation history
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Your purpose is to search the latest information and real-time data from the internet.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform on the internet.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto", // Let the model decide when to call the tool
    });

    // Add model’s reply to conversation history
    message.push(completion.choices[0].message);

    // -----------------------------------------
    // Step 2: Check if tool calls are requested
    // -----------------------------------------
    let tools = completion.choices[0].message.tool_calls;

    // If no tool calls are returned, break the loop and print final answer
    if (!tools) {
      console.log(`Ans : ${completion.choices[0].message.content}`);
      break;
    }

    // -----------------------------------------
    // Step 3: Handle Tool Calls (webSearch)
    // -----------------------------------------
    for (let tool of tools) {
      const functionName = tool.function.name;
      const functionArgs = JSON.parse(tool.function.arguments);

      if (functionName === "webSearch") {
        // Call webSearch function with provided arguments
        const toolRes = await webSearch(functionArgs);

        // Push tool result back to the conversation history
        message.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolRes,
        });
      }
    }
  }
};

/**
 * Web Search Function
 * Uses Tavily API to fetch live web search results
 */
const webSearch = async ({ query }) => {
  const res = await tvly.search(query, { maxResults: 3 });

  // Combine results into a single string for model consumption
  const finalRes = res.results.map((data) => data.content).join("\n\n");

  return finalRes;
};

// Execute the function
ToolCall1();
