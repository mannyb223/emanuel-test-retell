const express = require('express');
const app = express();
app.use(express.json());

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_API_URL = 'https://api.retellai.com/v1';

// This is a helper function to make API calls without the broken SDK.
async function makeRetellApiCall(endpoint, method = 'GET', body = null) {
  if (!RETELL_API_KEY) {
    throw new Error("RETELL_API_KEY environment variable not set on Render.");
  }
  
  const headers = {
    'Authorization': `Bearer ${RETELL_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  // Use the built-in 'fetch' which is guaranteed to work.
  const response = await fetch(`${RETELL_API_URL}/${endpoint}`, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Retell API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}


// --- Your Server's Endpoints ---

// This endpoint now exists and matches your schema.
app.get('/list-agents', async (req, res) => {
  try {
    const agents = await makeRetellApiCall('list-agents');
    res.status(200).json(agents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// This endpoint also now exists and matches your schema.
app.post('/create-call', async (req, res) => {
  try {
    // The body from the GPT uses 'from', 'to', 'agent_id'.
    // The Retell API needs 'from_number', 'to_number', 'agent_id'.
    // We translate the request body here.
    const apiBody = {
      from_number: req.body.from,
      to_number: req.body.to,
      agent_id: req.body.agent_id
    };
    const call = await makeRetellApiCall('create-call', 'POST', apiBody);
    res.status(200).json(call);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server with custom fetch is running on port ${PORT}.`);
});