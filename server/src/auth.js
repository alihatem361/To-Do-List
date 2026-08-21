const jwt = require('jsonwebtoken');

// Fine for local development. Set JWT_SECRET in the environment for anything real.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const TOKEN_TTL = '7d';

const signToken = (user) => jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL });

// The app sends `Authorization: Bearer <token>` on every /api/tasks call.
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in again.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

// Never leak the password hash back to the client.
const publicUser = ({ id, fullName, email, createdAt }) => ({ id, fullName, email, createdAt });

module.exports = { signToken, requireAuth, publicUser };
