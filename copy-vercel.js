import fs from 'fs';

try {
  fs.rmSync('.vercel', { recursive: true, force: true });
  if (fs.existsSync('frontend/.vercel')) {
    fs.cpSync('frontend/.vercel', '.vercel', { recursive: true });
    console.log('Successfully copied frontend/.vercel to root .vercel');
  } else {
    console.warn('Warning: frontend/.vercel does not exist, nothing to copy.');
  }
} catch (err) {
  console.error('Failed to copy .vercel folder:', err);
  process.exit(1);
}
