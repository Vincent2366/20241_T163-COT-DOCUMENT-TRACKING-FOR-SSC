const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

exports.authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  // Logic to verify token (using JWT or similar)
  try {
    // const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
    // req.user = decoded;  // Optionally set user data for further steps
    console.log("Token is valid, authentication passed.");
    next(); // Proceed to the next middleware or controller
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized, invalid token." });
  }
};

