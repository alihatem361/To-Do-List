const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

// Every route below is scoped to the logged-in user.
router.use(requireAuth);

const ownedBy = (task, userId) => task.userId === userId;

const validateTitle = (title) => {
  const trimmed = String(title || '').trim();
  if (!trimmed) return 'Title is required';
  if (trimmed.length > 100) return 'Title must be less than 100 characters';
  return null;
};

router.get('/', (req, res) => {
  const tasks = db.read().tasks.filter((t) => ownedBy(t, req.user.id));
  res.json(tasks);
});

router.get('/:id', (req, res) => {
  const task = db
    .read()
    .tasks.find((t) => t.id === Number(req.params.id) && ownedBy(t, req.user.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.post('/', (req, res) => {
  const { title, description } = req.body || {};

  const titleError = validateTitle(title);
  if (titleError) return res.status(400).json({ message: titleError });

  const task = db.update((data) => {
    const created = {
      id: data.nextTaskId++,
      userId: req.user.id,
      title: String(title).trim(),
      description: String(description || '').trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.tasks.push(created);
    return created;
  });

  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const { title, description, completed } = req.body || {};

  if (title !== undefined) {
    const titleError = validateTitle(title);
    if (titleError) return res.status(400).json({ message: titleError });
  }

  const task = db.update((data) => {
    const found = data.tasks.find(
      (t) => t.id === Number(req.params.id) && ownedBy(t, req.user.id)
    );
    if (!found) return null;

    if (title !== undefined) found.title = String(title).trim();
    if (description !== undefined) found.description = String(description).trim();
    if (completed !== undefined) found.completed = Boolean(completed);
    found.updatedAt = new Date().toISOString();

    return found;
  });

  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.patch('/:id/toggle', (req, res) => {
  const task = db.update((data) => {
    const found = data.tasks.find(
      (t) => t.id === Number(req.params.id) && ownedBy(t, req.user.id)
    );
    if (!found) return null;

    found.completed = !found.completed;
    found.updatedAt = new Date().toISOString();

    return found;
  });

  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const removed = db.update((data) => {
    const index = data.tasks.findIndex(
      (t) => t.id === Number(req.params.id) && ownedBy(t, req.user.id)
    );
    if (index === -1) return null;
    return data.tasks.splice(index, 1)[0];
  });

  if (!removed) return res.status(404).json({ message: 'Task not found' });
  res.json({ id: removed.id, message: 'Task deleted' });
});

module.exports = router;
