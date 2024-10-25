// api/fetch-ogp.js

import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const ogTitle = $("meta[property='og:title']").attr('content') || '';
    const ogDescription = $("meta[property='og:description']").attr('content') || '';
    const ogImage = $("meta[property='og:image']").attr('content') || '';

    res.status(200).json({
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
    });
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    res.status(500).json({ error: 'Error fetching OGP data' });
  }
};
