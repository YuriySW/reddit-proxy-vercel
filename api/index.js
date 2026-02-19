export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, 'http://localhost');

    const redditUrl = `https://api.reddit.com${url.pathname}${url.search}&raw_json=1`;

    console.log('Proxying to:', redditUrl);

    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json',
      },
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Proxy failed'});
  }
}
