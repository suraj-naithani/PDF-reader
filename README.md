# PDF Reader
A full-stack application that allows users to upload PDF files, process them using LangChain and OpenAI embeddings, and perform question-answering on the document content.

## Project Structure

```
├── client/               # Next.js frontend application
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   └── lib/            # Utility functions
└── server/             # Express.js backend application
    ├── uploads/        # PDF file upload directory
    ├── index.js        # Main server file
    └── worker.js       # Background processing worker
```

## Features

- PDF file upload and processing
- Document chunking and embedding generation
- Vector storage using Qdrant
- Natural language querying of PDF contents
- Background job processing with BullMQ

## Prerequisites

- Node.js >= 16
- Redis server (for BullMQ)
- OpenAI API key
- Qdrant vector database instance

## Environment Setup

### Server Configuration
Create a `.env` file in the server directory:

```env
OPENAI_API_KEY=your-openai-api-key
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_URL=your-qdrant-instance-url
```

## Installation

### Server Setup

```bash
cd server
npm install
npm run dev        # Start the server
npm run dev:worker # Start the background worker
```

### Client Setup

```bash
cd client
npm install
npm run dev
```

## Tech Stack

### Backend
- Express.js - Web server framework
- LangChain - LLM framework
- OpenAI - AI models and embeddings
- BullMQ - Background job processing
- Qdrant - Vector database
- Multer - File upload handling

### Frontend
- Next.js - React framework
- Tailwind CSS - Styling
- Clerk - Authentication

## API Endpoints

### `POST /upload/pdf`
Upload a PDF file for processing

### `GET /chat?message=<query>`
Query the processed PDF content

## Architecture

1. User uploads PDF through the frontend
2. File is saved to server's upload directory
3. Background worker processes PDF:
   - Splits into chunks
   - Generates embeddings
   - Stores in Qdrant
4. User can query document content through chat interface
5. Server retrieves relevant context and generates response using GPT-4

## Development

```bash
# Run server in development mode
npm run dev

# Run worker in development mode
npm run dev:worker
```
