import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Worker } from "bullmq";

const worker = new Worker("file-upload-queue",
    async (job) => {
        console.log("Processing job:", job.data);
        const data = JSON.parse(job.data);

        const loader = new PDFLoader(data.path);
        const docs = await loader.load();

        const embeddings = new OpenAIEmbeddings({
            model: 'text-embedding-3-small',
            apiKey: process.env.OPENAI_API_KEY,
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL,
                collectionName: "langchainjs-testing",
                apiKey: process.env.QDRANT_API_KEY,
            }
        );
        await vectorStore.addDocuments(docs);
        console.log(`All docs are added to vector store`);
    },
    { concurrency: 100, connection: { host: 'localhost', port: 6379 } }
);
