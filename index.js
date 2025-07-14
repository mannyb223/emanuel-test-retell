const express = require('express');
const Retell = require('retell-sdk').default;

const app = express();
app.use(express.json());

// Your API key is loaded from the Render environment variables
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY,
});

// Generic error handler to reduce repetition
const handleRequest = async (res, operation) => {
  try {
    const result = await operation();
    res.status(result.statusCode || 200).json(result.data);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(error.statusCode || 500).json({
      error: 'An error occurred with the Retell API.',
      details: error.message,
    });
  }
};

// ===== Call Endpoints =====

// Create a Phone Call
app.post('/calls/phone', (req, res) => {
  handleRequest(res, () => retell.call.create(req.body));
});

// Create a Web Call
app.post('/calls/web', (req, res) => {
  // Note: The official SDK might not have a dedicated web call function.
  // This assumes the 'create' method can handle it or you use a custom implementation.
  // For the official SDK, you might need to adjust parameters for web calls.
  // This endpoint is a placeholder for that logic.
  handleRequest(res, () => retell.call.create(req.body));
});

// Get a specific Call
app.get('/calls/:callId', (req, res) => {
  const { callId } = req.params;
  handleRequest(res, () => retell.call.retrieve(callId));
});

// List all Calls
app.get('/calls', (req, res) => {
  handleRequest(res, () => retell.call.list(req.query));
});

// Note: The official Retell Node SDK (v2.1.2) does not support deleting or updating calls.
// The community server you referenced has custom logic for this, which we omit here
// to stick to the official, supported methods.

// ===== Agent Endpoints =====

// Create an Agent
app.post('/agents', (req, res) => {
  handleRequest(res, () => retell.agent.create(req.body));
});

// Get a specific Agent
app.get('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  handleRequest(res, () => retell.agent.retrieve(agentId));
});

// List all Agents
app.get('/agents', (req, res) => {
  handleRequest(res, () => retell.agent.list(req.query));
});

// Update an Agent
app.patch('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  handleRequest(res, () => retell.agent.update(agentId, req.body));
});

// Delete an Agent
app.delete('/agents/:agentId', (req, res) => {
    const { agentId } = req.params;
    handleRequest(res, async () => {
        await retell.agent.delete(agentId);
        return { statusCode: 204, data: {} }; // Return 204 No Content on success
    });
});


// ===== Phone Number Endpoints =====

// Create (purchase) a Phone Number
app.post('/phone-numbers', (req, res) => {
  handleRequest(res, () => retell.phoneNumber.create(req.body));
});

// Get a specific Phone Number
app.get('/phone-numbers/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  handleRequest(res, () => retell.phoneNumber.retrieve(phoneNumber));
});

// List all Phone Numbers
app.get('/phone-numbers', (req, res) => {
  handleRequest(res, () => retell.phoneNumber.list(req.query));
});

// Update a Phone Number
app.patch('/phone-numbers/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  handleRequest(res, () => retell.phoneNumber.update(phoneNumber, req.body));
});

// Delete (release) a Phone Number
app.delete('/phone-numbers/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  handleRequest(res, async () => {
    await retell.phoneNumber.delete(phoneNumber);
    return { statusCode: 204, data: {} };
  });
});

// ===== Voice Endpoints =====

// Get a specific Voice
app.get('/voices/:voiceId', (req, res) => {
  const { voiceId } = req.params;
  handleRequest(res, () => retell.voice.retrieve(voiceId));
});

// List all Voices
app.get('/voices', (req, res) => {
  handleRequest(res, () => retell.voice.list(req.query));
});

// ===== Retell LLM Endpoints =====

// Create a Retell LLM
app.post('/llms', (req, res) => {
  handleRequest(res, () => retell.llm.create(req.body));
});

// Get a specific Retell LLM
app.get('/llms/:llmId', (req, res) => {
  const { llmId } = req.params;
  handleRequest(res, () => retell.llm.retrieve(llmId));
});

// List all Retell LLMs
app.get('/llms', (req, res) => {
  handleRequest(res, () => retell.llm.list(req.query));
});

// Update a Retell LLM
app.patch('/llms/:llmId', (req, res) => {
  const { llmId } = req.params;
  handleRequest(res, () => retell.llm.update(llmId, req.body));
});

// Delete a Retell LLM
app.delete('/llms/:llmId', (req, res) => {
    const { llmId } = req.params;
    handleRequest(res, async () => {
        await retell.llm.delete(llmId);
        return { statusCode: 204, data: {} };
    });
});


// ===== Server Initialization =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Full Retell MCP Server is running on port ${PORT}`);
});