const { Pinecone } = require('@pinecone-database/pinecone');

let chatgpt = null;

function ensurePinecone() {
    if (chatgpt) return chatgpt;
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        console.warn('[vector.service] PINECONE_API_KEY not set; vector operations will be no-ops.');
        return null;
    }
    try {
        const pc = new Pinecone({ apiKey });
        chatgpt = pc.index(process.env.PINECONE_INDEX || 'chat-gpt');
        return chatgpt;
    } catch (err) {
        console.error('[vector.service] Failed to initialize Pinecone client:', err.message);
        return null;
    }
}



const createMemoryVector = async (messageId, vectors, metadata) => {
    const index = ensurePinecone();
    if (!index) return false;
    await index.upsert([
        {
            id: messageId,
            values: vectors,
            metadata: metadata
        }
    ]);
    return true;
};


const queryMemory = async (vector, topK) => {
    const index = ensurePinecone();
    if (!index) return [];
    const data = await index.query({
        vector: vector,
        topK: topK,
        includeMetadata: true
    });
    return data.matches;
};

module.exports = {
    createMemoryVector,
    queryMemory
}
