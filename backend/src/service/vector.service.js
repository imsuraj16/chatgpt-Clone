const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINOCONE_API_KEY });
const chatgpt = pc.index('chat-gpt');



const createMemoryVector = async (messageId, vectors, metadata) => {

    await chatgpt.upsert([{
        id: messageId,
        values: vectors,
        metadata: metadata
    }])
}


const queryMemory = async(vector,topK)=>{

   const data =  await chatgpt.query({
        vector : vector,
        topK : topK,
        includeMetadata : true
    })

    return data.matches
}

module.exports = {
    createMemoryVector,
    queryMemory
}
