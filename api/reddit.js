export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://www.reddit.com/best.json?limit=10', {
      headers: {
        'User-Agent': 'RedditProxy/1.0 (test)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Reddit returned ${response.status}`,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy failed:', err.message);
    res.status(500).json({error: 'Proxy failed', details: err.message});
  }
}
