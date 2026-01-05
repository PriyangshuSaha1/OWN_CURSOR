//Building a Mini Cursor.

import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import readlineSync from "readline-sync";
import "dotenv/config";
import util from "util";
import os from "os";

const platform = os.platform();
const execute = util.promisify(exec);

// Configure the client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Memory
const History = [];

// tool: execute shell/terminal command
async function executeCommand({ command }) {
  try {
    const { stdout, stderr } = await execute(command);

    if (stderr) {
      return `Error: ${stderr}`;
    }

    return `Success: ${stdout}`;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// Tool declaration
const commandExecuter = {
  name: "executeCommand",
  description:
    "It takes any shell/terminal command and execute it. It will help us to create, read, write, update, delete any folder and file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description:
          "It is the terminal/shell command. Ex: mkdir calculator , touch calculator/index.html etc",
      },
    },
    required: ["command"],
  },
};

// Function to build website based on user query
async function buildWebsite() {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `
You are a website Builder, which will create the frontend part of the website using terminal/shell Command.
You will give shell/terminal command one by one and our tool will execute it.

Give the command according to the Operating system we are using.
My Current user Operating system is: ${platform}.

Kindly use best practice for commands, it should handle multiline write also efficiently.

Your Job
1: Analyse the user query
2: Take the necessary action after analysing the query by giving proper shell command according to the user operating system.

Step By Step Guide

1: First you have to create the folder for the website which we have to create, ex: mkdir calculator
2: Give shell/terminal command to create html file , ex: touch calculator/index.html
3: Give shell/terminal command to create CSS file
4: Give shell/terminal command to create Javascript file
5: Give shell/terminal command to write on html file
6: Give shell/terminal command to write on css file
7: Give shell/terminal command to write on javascript file
8: Fix the error if they are present at any step by writing, update or deleting
        `,
        tools: [
          {
            functionDeclarations: [commandExecuter],
          },
        ],
      },
    });

    // Check if the model has requested a function call
    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];

      // CODE QUALITY: Pushing the model's function call to history.
      History.push({
        role: "model",
        parts: [{ functionCall }],
      });

      const toolResponse = await executeCommand(functionCall.args);

      const functionResponsePart = {
        name: functionCall.name,
        response: {
          result: toolResponse,
        },
      };

      // CODE QUALITY: Pushing the tool's response to history
      History.push({
        role: "user",
        parts: [{ functionResponse: functionResponsePart }],
      });
    } else {
      // Normal text response → stop
      if (result.response?.text()) {
        console.log(result.response.text());
        History.push({
          role: "model",
          parts: [{ text: result.response.text() }],
        });
      }
      break;
    }
  }
}

// Main Loop
while (true) {
  // user input lete hai in Command Line.
  const question = readlineSync.question("Ask me anything -->  ");

  if (question === "exit") {
    break;
  }

  History.push({
    role: "user",
    parts: [{ text: question }],
  });

  await buildWebsite();
}

// You can include the below one also in your system instruction

// For Windows, write multi-line HTML like this:

//             echo ^<!DOCTYPE html^> > calculator\\index.html
//             echo ^<html^> >> calculator\\index.html
//             echo ^<head^> >> calculator\\index.html
//             echo   ^<title^>Calculator^</title^> >> calculator\\index.html
//             echo   ^<link rel="stylesheet" href="style.css"^> >> calculator\\index.html
//             echo ^</head^> >> calculator\\index.html
//             echo ^<body^> >> calculator\\index.html
//             echo   ^<div id="calculator"^>^</div^> >> calculator\\index.html
//             echo   ^<script src="script.js"^>^</script^> >> calculator\\index.html
//             echo ^</body^> >> calculator\\index.html
//             echo ^</html^> >> calculator\\index.html

// For Mac/Linux, write multi-line HTML like this:

//         cat > calculator/index.html << 'EOF'
//         <!DOCTYPE html>
//         <html>
//         <head>
//         <title>Calculator</title>
//         <link rel="stylesheet" href="style.css">
//         </head>
//         <body>
//         <div id="calculator"></div>
//         <script src="script.js"></script>
//         </body>
//         </html>
//         EOF

// AI agent, code Review kar de
