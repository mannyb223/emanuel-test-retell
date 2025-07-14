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
const PORT = process.env.PORT || 8080;

// THIS IS THE ENDPOINT THE GPT IS LOOKING FOR
app.get('/list-agents', async (req, res) => {
  try {
    const agents = await retell.agent.list();
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// THIS IS THE OTHER ENDPOINT THE GPT NEEDS
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
     console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Simple Retell API server listening on port ${PORT}`);
});