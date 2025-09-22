// Vercel Serverless Function để proxy API calls và bypass CORS
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get hash from query parameter
        const { hash } = req.query;
        
        if (!hash) {
            return res.status(400).json({ error: 'Hash parameter is required' });
        }

        // Validate hash format (MD5 should be 32 characters)
        if (!/^[a-f0-9]{32}$/i.test(hash)) {
            return res.status(400).json({ error: 'Invalid hash format' });
        }

        // Call the actual API
        const apiUrl = `https://mailreader.zettix.net/api/request/mail/id/${hash}/`;
        console.log('Proxying request to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Cursor-AI-Code-Getter/1.0',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('API request failed:', response.status, response.statusText);
            return res.status(response.status).json({ 
                error: `API request failed: ${response.status} ${response.statusText}` 
            });
        }

        const data = await response.json();
        console.log('API response received, data length:', Array.isArray(data) ? data.length : 'not array');

        // Return the data with proper headers
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
}
