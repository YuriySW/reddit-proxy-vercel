const {TextDecoder} = require('util'); // ← добавь это в начало файла (Node.js 11+ имеет встроенный)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, 'https://dummy');
    let path = url.pathname + (url.search || '');

    const pikabuUrl = `https://pikabu.ru${path}`;

    console.log('Proxying to:', pikabuUrl);

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
      },
      redirect: 'follow',
    });

    // Получаем сырые байты (ArrayBuffer)
    const arrayBuffer = await response.arrayBuffer();

    // Пробуем декодировать как windows-1251 (часто спасает на Pikabu)
    let decoder = new TextDecoder('windows-1251');
    let data = decoder.decode(arrayBuffer);

    // Если выглядит как мусор — fallback на UTF-8
    if (data.includes('�') || data.match(/[^\x00-\x7F]{3,}/) === null) {
      // грубая проверка на битые символы
      decoder = new TextDecoder('utf-8');
      data = decoder.decode(arrayBuffer);
    }

    // Content-Type принудительно с UTF-8, чтобы браузер не путался
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Прокидываем другие заголовки
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('Set-Cookie', setCookie);

    res.status(response.status).send(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({error: 'Proxy failed', details: err.message});
  }
}
