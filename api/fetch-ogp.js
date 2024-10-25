export default async (req, res) => {
    // CORSヘッダーの設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'No URL provided' });
    }
  
    try {
      // axiosのリクエストを実行
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
  
      const ogTitle = $("meta[property='og:title']").attr('content') || '';
      const ogDescription = $("meta[property='og:description']").attr('content') || '';
      const ogImage = $("meta[property='og:image']").attr('content') || '';
  
      // 正常に取得できた場合
      res.status(200).json({
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
      });
    } catch (error) {
      // エラーハンドリングを強化
      if (error.response) {
        // サーバーからのレスポンスが返ってきたが、ステータスコードが200以外
        console.error(`Error fetching OGP data: ${error.message}, Status Code: ${error.response.status}`);
        res.status(error.response.status).json({
          error: `Error fetching OGP data: ${error.response.status}`,
          message: error.response.data
        });
      } else if (error.request) {
        // リクエストが送信されたがレスポンスがない場合
        console.error('No response received:', error.request);
        res.status(500).json({ error: 'No response received from the server.' });
      } else {
        // その他のエラー
        console.error('Error setting up request:', error.message);
        res.status(500).json({ error: 'Error setting up request.' });
      }
    }
  };
  