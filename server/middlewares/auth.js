const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Verifying token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret');
        console.log('Decoded token:', decoded);
        
        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message 
        });
    }
};

module.exports = { authenticateToken };
  