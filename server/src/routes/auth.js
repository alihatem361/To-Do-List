const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, publicUser } = require('../auth');

const router = express.Router();

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body || {};
  const normalized = normalizeEmail(email);

  if (!fullName || !normalized || !password) {
    return res.status(400).json({ message: 'Full name, email and password are required' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (db.read().users.some((u) => u.email === normalized)) {
    return res.status(409).json({ message: 'An account with that email already exists' });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = db.update((data) => {
    const created = {
      id: data.nextUserId++,
      fullName: String(fullName).trim(),
      email: normalized,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    data.users.push(created);
    return created;
  });

  // Returning a token here logs the user straight in after signing up.
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const normalized = normalizeEmail(email);

  if (!normalized || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.read().users.find((u) => u.email === normalized);

  // Same message either way so the response can't be used to enumerate accounts.
  if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

module.exports = router;
