export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://www.reddit.com/best.json?limit=10');
    if (!response.ok) {
      return res
        .status(response.status)
        .json({error: `Reddit ${response.status}`});
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}
