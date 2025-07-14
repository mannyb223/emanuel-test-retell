const express = require('express');
const { Retell } = require('retell-sdk');

// Get your API key from environment variables
const RETELL_API_KEY = process.env.RETELL_API_KEY;
if (!RETELL_API_KEY) {
  console.error("FATAL ERROR: RETELL_API_KEY environment variable is not set.");
  process.exit(1);
}

const app = express();
app.use(express.json());
const retell = new Retell({ apiKey: RETELL_API_KEY });
const PORT = process.env.PORT || 8080;

// Endpoint to list all agents
app.get('/list-agents', async (req, res) => {
  try {
    const agents = await retell.agent.list();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a call
app.post('/create-call', async (req, res) => {
  try {
    const { from, to, agent_id } = req.body;
    const call = await retell.call.create({
      from_number: from,
      to_number: to,
      agent_id: agent_id,
    });
    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Simple Retell API server listening on port ${PORT}`);
});