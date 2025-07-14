const express = require('express');
const { Retell } = require('retell-sdk');

const app = express();
app.use(express.json());

// Get your API key from environment variables
if (!process.env.RETELL_API_KEY) {
  console.error("FATAL ERROR: RETELL_API_KEY environment variable is not set.");
  process.exit(1);
}

const retell = new Retell({ apiKey: process.env.RETELL_API_KEY });

const PORT = process.env.PORT || 3000;

// Test endpoint to see if the server is alive
app.get('/', (req, res) => {
  res.send('The simple server is running!');
});

// Endpoint to list all agents
app.get('/list-agents', async (req, res) => {
  try {
    const agents = await retell.agent.list();
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a call
app.post('/create-call', async (req, res) => {
  try {
    const { from_number, to_number, agent_id } = req.body;
    const call = await retell.call.create({
      from_number,
      to_number,
      agent_id,
    });
    res.status(200).json(call);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Simple Retell server listening on port ${PORT}`);
});