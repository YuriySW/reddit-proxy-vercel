export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const redditRes = await fetch('https://www.reddit.com/best.json?limit=10', {
      headers: {
        'User-Agent': 'RedditProxy/1.0',
      },
    });

    if (!redditRes.ok) {
      return res
        .status(redditRes.status)
        .json({error: 'Reddit error', status: redditRes.status});
    }

    const data = await redditRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Proxy failed', details: err.message});
  }
}
