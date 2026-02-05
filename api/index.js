export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const redditResponse = await fetch(
      'https://api.reddit.com/best.json?limit=10',
      {
        headers: {
          'User-Agent': 'blogget-educational-project/1.0',
        },
      },
    );

    // 1. Получаем и логируем статус и текст ошибки, если она есть
    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.error('Reddit API Error:', redditResponse.status, errorText);

      // 2. Возвращаем понятную ошибку с реальным статусом от Reddit
      return res.status(redditResponse.status).json({
        error: `Reddit API error: ${redditResponse.statusText}`,
        status: redditResponse.status,
        details: errorText, // Передаем детали, если API их вернуло
      });
    }

    const data = await redditResponse.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy server error:', err);
    res.status(500).json({
      error: 'Proxy server error',
      details: err.message,
    });
  }
}
