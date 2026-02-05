export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  try {
    const response = await fetch('https://www.reddit.com/best.json?limit=10', {
      headers: {
        'User-Agent': 'BloggetApp/0.1 (educational project by yuriysw)',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({error: 'Failed to fetch Reddit posts'});
  }
}
