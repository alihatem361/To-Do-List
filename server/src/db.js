const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

const EMPTY = { users: [], tasks: [], nextUserId: 1, nextTaskId: 1 };

const read = () => {
  try {
    return { ...EMPTY, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) };
  } catch {
    // No file yet (or it got corrupted) — start from a clean slate.
    return { ...EMPTY };
  }
};

const write = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Every mutation goes through here so the file is always written back.
const update = (mutator) => {
  const data = read();
  const result = mutator(data);
  write(data);
  return result;
};

module.exports = { read, write, update };
