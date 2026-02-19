export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, 'http://localhost');

    const pikabuUrl = `https://pikabu.ru${path}${url.search}`;

    console.log('Proxying to:', pikabuUrl);

    const response = await fetch(pikabuUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
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
