# Jargon-Free Contract Scanner

A personal project I built to make contracts easier to understand.

Most people (including me) don't read contracts because they're long, full of legal jargon, and difficult to understand. The goal of this project is to let someone upload a PDF contract and receive a plain English explanation of the important parts, especially any clauses that could be risky.

---

## What it does

- Upload a PDF contract
- Extracts the text from the PDF
- Uses an AI model to analyze the contract
- Finds potentially risky clauses
- Explains each clause in plain English
- Gives an overall risk level for the contract

---

## Example

Instead of reading something like:

> "The Client agrees that all previously paid amounts are non-refundable."

The app explains it as:

> "If you're unhappy with the work, you won't get your money back."

---

## Tech Stack

- Next.js
- React
- TypeScript
- Groq API
- AI SDK
- Zod
- pdf-parse

---

## Why I Built This

I wanted to build something that solves a real problem instead of another chatbot.

This project also let me practice working with APIs, file uploads, PDF parsing, prompt engineering, and structured AI responses.

One thing I learned quickly is that extracting text from PDFs isn't always straightforward. Some PDFs are scanned images instead of selectable text, and formatting can be inconsistent. I also spent quite a bit of time getting the AI to only report things that actually exist in the contract instead of making assumptions.

---

## What I Learned

During this project I learned how to:

- Work with file uploads in Next.js
- Extract text from PDF documents
- Connect to an LLM using the Groq API
- Design prompts that reduce hallucinations
- Parse and validate AI responses
- Build an API route in Next.js

---

## Current Features

- PDF upload
- Contract analysis
- Plain English explanations
- Overall risk rating
- Individual red flag detection

---

## Future Improvements

This project is still a work in progress.

Some features I want to add are:

- Highlight the risky clauses directly inside the PDF
- Drag-and-drop file uploads
- Better UI and animations
- Downloadable analysis report
- Support for larger contracts by analyzing them in sections
- More detailed explanations for different types of contracts

---

## Running the Project

Clone the repository:

```bash
git clone <your-repository-url>
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
GROQ_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

---

## Disclaimer

This project is for educational purposes and should not be considered legal advice. The AI can make mistakes, so important contracts should always be reviewed by a qualified legal professional.