export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://www.reddit.com/best.json?limit=10', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reddit error details:', errorText);
      return res
        .status(response.status)
        .json({error: `Reddit: ${response.status}`, details: errorText});
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({error: 'Proxy failed', details: err.message});
  }
}
