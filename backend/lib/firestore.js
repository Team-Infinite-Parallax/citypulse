import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INCIDENTS_FILE = path.join(__dirname, '..', 'data', 'incidents.json');

const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '';
export const useFirestore = process.env.USE_FIRESTORE === 'true' && Boolean(projectId);

let db;
if (useFirestore) {
  try {
    db = new Firestore({ projectId });
    console.log(`[Firestore] Initialized client for project: ${projectId}`);
  } catch (err) {
    console.error(`[Firestore] Initialization failed: ${err.message}`);
  }
} else {
  console.warn('[Firestore] Running in fallback mode (USE_FIRESTORE is not true or GCP_PROJECT_ID is empty).');
}

// In-memory fallback for memos (since they are in-memory in routes/actions.js initially)
const fallbackMemos = [
  {
    id: 'memo-1',
    title: 'Deploy traffic personnel to MG Road',
    department: 'Bengaluru Traffic Police',
    status: 'DRAFT',
    justification: 'Sustained high congestion (>80) during peak hours on MG Road over the last 3 days. Manual traffic direction may help reduce bottlenecks.',
    action_items: ['Deploy 2 officers at Minsk Square', 'Coordinate with BMTC for bus lane enforcement', 'Set up temporary diversions if congestion exceeds 90'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'memo-2',
    title: 'Signal timing review — Hebbal Junction',
    department: 'Road Infrastructure Authority',
    status: 'DISPATCHED',
    justification: 'Signal failure reported at Hebbal junction during morning peak. Emergency timing pattern recommended.',
    action_items: ['Review signal timing sequence', 'Deploy maintenance crew for inspection'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Fallback incidents handlers
const fallbackGetIncidents = async () => {
  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[Firestore Fallback] Error reading incidents.json:', err.message);
    return [];
  }
};

const fallbackAddIncident = async (incident) => {
  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    const incidents = JSON.parse(data);
    incidents.push(incident);
    await fs.writeFile(INCIDENTS_FILE, JSON.stringify(incidents, null, 2));
    return incident;
  } catch (err) {
    console.error('[Firestore Fallback] Error writing to incidents.json:', err.message);
    throw err;
  }
};

// Fallback memos handlers
const fallbackGetMemos = async () => {
  return [...fallbackMemos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const fallbackAddMemo = async (memo) => {
  fallbackMemos.unshift(memo);
  return memo;
};

const fallbackUpdateMemoStatus = async (id, status) => {
  const memo = fallbackMemos.find(m => m.id === id);
  if (memo) {
    memo.status = status;
    return true;
  }
  return false;
};

// --- Exported Helper Functions ---

export const getIncidents = async () => {
  if (useFirestore && db) {
    try {
      const snapshot = await db.collection('incidents').orderBy('timestamp', 'desc').get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push(doc.data());
      });
      return docs;
    } catch (err) {
      console.error('[Firestore] getIncidents failed, falling back to JSON:', err.message);
    }
  }
  return fallbackGetIncidents();
};

export const addIncident = async (incident) => {
  if (useFirestore && db) {
    try {
      await db.collection('incidents').doc(incident.incident_id).set(incident);
      return incident;
    } catch (err) {
      console.error('[Firestore] addIncident failed, falling back to JSON:', err.message);
    }
  }
  return fallbackAddIncident(incident);
};

export const getMemos = async () => {
  if (useFirestore && db) {
    try {
      const snapshot = await db.collection('memos').orderBy('created_at', 'desc').get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push(doc.data());
      });
      return docs;
    } catch (err) {
      console.error('[Firestore] getMemos failed, falling back to in-memory:', err.message);
    }
  }
  return fallbackGetMemos();
};

export const addMemo = async (memo) => {
  if (useFirestore && db) {
    try {
      await db.collection('memos').doc(memo.id).set(memo);
      return memo;
    } catch (err) {
      console.error('[Firestore] addMemo failed, falling back to in-memory:', err.message);
    }
  }
  return fallbackAddMemo(memo);
};

export const updateMemoStatus = async (id, status) => {
  if (useFirestore && db) {
    try {
      const docRef = db.collection('memos').doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({ status });
        return true;
      } else {
        console.warn(`[Firestore] updateMemoStatus: Memo with ID ${id} not found in Firestore.`);
      }
    } catch (err) {
      console.error('[Firestore] updateMemoStatus failed, falling back to in-memory:', err.message);
    }
  }
  return fallbackUpdateMemoStatus(id, status);
};
