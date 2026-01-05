
# 🧠 MINI Cursor – AI Website Builder

A **mini version of Cursor AI** built to understand how **LLMs, AI Agents (Tools), and server-side execution** work together to automate code and website creation.

This project uses **Google Gemini (GenAI)** to analyze user input and dynamically create frontend projects using **terminal commands**.

---

## 🚀 What This Project Does

- Accepts **natural language input** from the user
- Uses an **LLM (Gemini)** to understand intent
- Decides **which terminal command or file operation is required**
- Automatically:
  - Creates folders
  - Creates files
  - Writes complete HTML, CSS, and JavaScript code
- Mimics the core idea behind **Cursor-like AI tools**

---

## 🧩 Key Concepts Used

- Large Language Models (LLM)
- AI Agents / Tools
- Function Calling
- Prompt Engineering
- Automation with AI
- Node.js Command Execution

---

## 📁 Project Structure

```

MINI-CURSOR/
│
├── index.js              # Main AI agent logic
├── index.html            # Sample generated HTML
├── style.css             # Sample generated CSS
├── script.js             # Sample generated JavaScript
├── package.json          # Project metadata & dependencies
├── package-lock.json     # Dependency lock file
└── README.md             # Documentation

```

---

## 🛠️ Technologies Used

- JavaScript (ES Modules)
- Node.js
- Google Gemini API (`@google/genai`)
- readline-sync
- child_process
- dotenv

---

## ⚙️ How It Works (Flow)

```

User Input
↓
Server (Node.js)
↓
LLM (Gemini)
↓
Tool Selection (AI Agent)
↓
Terminal Command Execution
↓
Website Files Generated

````

> ⚠️ **Important Note**  
> The LLM **does not execute code**.  
> It only decides **what should be done**.  
> Actual execution happens on the **server using tools**.

---

## ▶️ How to Run the Project

### 1️⃣ Install dependencies
```bash
npm install
````

### 2️⃣ Add your Gemini API key

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3️⃣ Run the project

```bash
node index.js
```

### 4️⃣ Example Prompts

```
Create a calculator website
Create a landing page using HTML and CSS
```

Type `exit` to stop the program.

---

## 🧠 Learning Purpose

This project is built for **learning and understanding**:

* How Cursor-like AI tools work internally
* How LLMs + Tools enable automation
* Why LLMs don’t fetch real-time data or run code
* How AI agents are designed in real-world systems

---

## ⚠️ Disclaimer

* This is a **learning project**
* Commands are executed locally
* Not production-ready
* Shell execution should be sandboxed in real applications

---

## 🙌 Credits

Built while learning **Generative AI**
Inspired by **Cursor AI**
Guidance: **Rohit Negi (CoderArmy)**

---

## 📄 License

This project is licensed under the **ISC License**.

```
