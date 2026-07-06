import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMO_FILE = path.join(__dirname, '..', 'data', 'memos.json');

export const getMemos = async () => {
  try {
    const data = await fs.readFile(MEMO_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    console.error('Error reading memos.json:', err);
    return [];
  }
};

export const saveMemo = async (memo) => {
  const memos = await getMemos();
  
  // Update if exists, else append
  const idx = memos.findIndex(m => m.id === memo.id);
  if (idx >= 0) {
    memos[idx] = memo;
  } else {
    memos.unshift(memo);
  }

  await fs.writeFile(MEMO_FILE, JSON.stringify(memos, null, 2));
  return memo;
};
