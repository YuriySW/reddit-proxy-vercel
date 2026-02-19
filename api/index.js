export default async function handler(req, res) {
  // CORS заголовки (оставляем * для теста)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Правильно разбираем URL запроса
    const url = new URL(req.url, 'https://dummy'); // base не важен, главное — чтобы parse прошёл

    // path — это часть после домена, например /best?page=1 → /best?page=1
    let path = url.pathname;

    // Если хочешь убрать префикс /api/pikabu/ или /proxy/ — раскомментируй и подстрой
    // path = path.replace(/^\/(api\/)?(pikabu|proxy)\/?/, '/');

    const pikabuUrl = `https://pikabu.ru${path}${url.search || ''}`;

    console.log('Пытаемся проксировать →', pikabuUrl);

    const response = await fetch(pikabuUrl, {
      method: req.method,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow', // Pikabu иногда редиректит
    });

    const data = await response.text();

    // Копируем Content-Type от Pikabu (обычно text/html)
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(response.status).send(data);
  } catch (err) {
    console.error('Ошибка в прокси:', err.message || err);
    res.status(500).json({
      error: 'Proxy failed',
      details: err.message || 'Неизвестная ошибка fetch',
      url: req.url, // для дебага
    });
  }
}
