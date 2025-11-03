// Vercelサーバーレス関数 - APIキー隠蔽用
export default async function handler(req, res) {
    // CORS設定（必要に応じて）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONSリクエストの処理
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // POSTメソッドのみ許可
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed. Use POST.'
        });
    }

    try {
        // リクエストボディから必要な情報を取得
        const { utterance, username, uid } = req.body;

        // 入力値の検証
        if (!utterance || utterance.trim() === '') {
            return res.status(400).json({
                error: 'utterance is required'
            });
        }

        // 環境変数からAPIキーとエージェントIDを取得
        const MEBO_API_KEY = process.env.MEBO_API_KEY;
        const MEBO_AGENT_ID = process.env.MEBO_AGENT_ID;

        // 環境変数の存在確認
        if (!MEBO_API_KEY || !MEBO_AGENT_ID) {
            console.error('Missing environment variables');
            return res.status(500).json({
                error: 'Server configuration error'
            });
        }

        // MEBO APIへのリクエストボディを構築
        const requestBody = {
            'api_key': MEBO_API_KEY,
            'agent_id': MEBO_AGENT_ID,
            'utterance': utterance.trim(),
            'username': username || 'ユーザー',
            'uid': uid || 'anonymous'
        };

        // MEBO APIを呼び出し
        const response = await fetch('https://api-mebo.dev/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // MEBO APIのレスポンス確認
        if (!response.ok) {
            console.error(`MEBO API error: ${response.status}`);
            return res.status(500).json({
                error: 'AI service temporarily unavailable'
            });
        }

        // MEBO APIからのレスポンスを解析
        const content = await response.json();

        // レスポンスの構造確認
        if (!content.bestResponse || !content.bestResponse.utterance) {
            console.error('Invalid response structure from MEBO API');
            return res.status(500).json({
                error: 'Invalid response from AI service'
            });
        }

        // フロントエンドに結果を返す
        return res.status(200).json({
            response: content.bestResponse.utterance,
            status: 'success'
        });

    } catch (error) {
        // エラーログ出力
        console.error('Server error:', error);

        // エラーレスポンス
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Something went wrong. Please try again.'
        });
    }
}
