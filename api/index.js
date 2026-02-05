export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await fetch(
      'https://api.pushshift.io/reddit/search/submission?sort=desc&size=10',
      {
        headers: {
          // КЛЮЧЕВОЕ МЕСТО
          'User-Agent': 'blogget-educational-project/1.0',
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Pushshift error',
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
}
