export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return socket configuration
    const socketUrl =
      process.env.SOCKET_URL || 'https://your-socket-service.herokuapp.com';

    res.status(200).json({
      socketUrl: socketUrl,
      environment: process.env.VERCEL_ENV || 'development',
    });
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
}
