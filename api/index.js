export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, 'https://dummy-base.com');
    let path = url.pathname + (url.search || '');

    // Если фронт запрашивает /best?page=1 → Pikabu получит https://pikabu.ru/best?page=1
    const pikabuUrl = `https://pikabu.ru${path}`;

    console.log('Proxying to Pikabu:', pikabuUrl);

    const response = await fetch(pikabuUrl, {
      method: req.method,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://pikabu.ru/',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    });

    let data = await response.text();

    // Фикс кодировки: если Pikabu отдаёт без charset или в windows-1251 — принудительно UTF-8
    // (редко, но бывает на старых страницах)
    if (!response.headers.get('content-type')?.includes('charset=')) {
      data = new TextDecoder('utf-8').decode(new TextEncoder().encode(data));
    }

    // Прокидываем Content-Type и charset
    const contentType =
      response.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);

    // Важно: проксируем куки/заголовки, если Pikabu их требует
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('Set-Cookie', setCookie);

    res.status(response.status).send(data);
  } catch (err) {
    console.error('Pikabu proxy error:', err.message, err.stack);
    res.status(500).json({
      error: 'Proxy failed',
      message: err.message,
      url: req.url,
    });
  }
}
