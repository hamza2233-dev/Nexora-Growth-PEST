export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cid, zip_code } = req.body;

  if (!cid || !zip_code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const payload = {
    CID: cid,
    zip_code: zip_code,
    exposeCallerId: "yes"
  };

  try {
    const response = await fetch('https://rtb.ringba.com/v1/production/2f00edd2cd4845b8a33802a2dd9c08ec.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();
    return res.status(200).send(resultText);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
