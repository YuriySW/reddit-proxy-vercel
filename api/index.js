export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(
      'https://api.pushshift.io/reddit/search/submission?sort=desc&size=10',
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Pushshift returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({error: 'Proxy failed', details: err.message});
  }
}
