//Building a Mini Cursor.

import { GoogleGenAI } from "@google/genai";
import { Type } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import "dotenv/config";


// Configure the client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Memory
const History = [];

// Tool: write file using fs
async function writeFileTool({ filePath, content }) {
  try {
    const dir = path.dirname(filePath);

    // Create folder if not exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf8");
    return `✅ File written successfully: ${filePath}`;
  } catch (err) {
    return `❌ Error writing file: ${err.message}`;
  }
}

// Tool declaration
const writeFileToolInfo = {
  name: "writeFile",
  description: "Creates or updates files using Node.js fs module",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: "Path of the file (example: calculator/index.html)",
      },
      content: {
        type: Type.STRING,
        description: "Full content of the file",
      },
    },
    required: ["filePath", "content"],
  },
};


// Function to build website based on user query
async function buildWebsite() {

    while(true){

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
        config: { 
         systemInstruction:` You are a website Builder AI.

         Rules:
         1. You must create frontend websites using HTML, CSS, and JavaScript.
         2. You must NEVER give shell or terminal commands.
         3. You must ONLY create or update files using the writeFile tool.
         4. First create index.html, then style.css, then script.js.
         5. Always send FULL file content.

         Folder example:
         calculator/index.html
         calculator/style.css
         calculator/script.js
         `
         ,

         tools: [
            {
                functionDeclarations:[writeFileToolInfo]
            }
         ]
        },
    });

 // Check if the model has requested a function call or text response
    if(result.functionCalls && result.functionCalls.length > 0){

        const functionCall = result.functionCalls[0];

        // CODE QUALITY: Pushing the model's function call to history.
        History.push({
          role: "model",
          parts: [{ functionCall: functionCall }],
        });

        const toolResponse = await writeFileTool(functionCall.args);

        const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: toolResponse,
            },
        };

        // CODE QUALITY: Pushing the tool's response to history with the correct 'tool' role.
        History.push({
            role:'tool',
            parts:[{functionResponse: functionResponsePart}]
        });

        // After the tool's response is in history, we need to call generateContent again
        // to let the model process the tool's output and generate a user-friendly text response.
        const followUpResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: History, // Pass the updated history
            config: { tools: [{ functionDeclarations: [writeFileToolInfo] }] },
        });

        if (followUpResult.response.text()) {
            History.push({
                role: 'model',
                parts: [{ text: followUpResult.response.text() }]
            });
            console.log(followUpResult.response.text());
            break; // Exit after getting a text response
        } else {
            console.log("Model did not return a text response after tool execution.");
            break; // Exit to prevent infinite loop if model doesn't respond with text
        }
    }
    else{
        // Normal text response → stop
        console.log(result.response.text());
        History.push({
            role:"model",
            parts:[{text:result.response.text()}]
        });
        break;
    }

    }

    
}


// Main Loop
while(true){
    //user input lete hai in Command Line.
    const question = readlineSync.question("Ask me anything -->  ");
    
    if(question=='exit'){
        break;
    }
    
    History.push({
        role:'user',
        parts:[{text:question}]
    });
   
    await buildWebsite();

}
