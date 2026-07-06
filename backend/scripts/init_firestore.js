import { Firestore } from '@google-cloud/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INCIDENTS_FILE = path.join(__dirname, '..', 'data', 'incidents.json');

async function initFirestore() {
  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    console.error('Error: GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT env var is not set.');
    process.exit(1);
  }

  console.log(`Setting up Firestore database for project ${projectId}...`);
  const db = new Firestore({ projectId });

  try {
    const data = JSON.parse(await fs.readFile(INCIDENTS_FILE, 'utf-8'));
    console.log(`Read ${data.length} incidents from local file.`);

    const incidentsCol = db.collection('incidents');
    
    // Seed incidents
    console.log('Seeding incidents collection in Firestore...');
    const batch = db.batch();
    for (const incident of data) {
      const docRef = incidentsCol.doc(incident.incident_id);
      batch.set(docRef, incident);
    }
    await batch.commit();
    console.log('Incidents collection seeding completed!');

    // Seed memos
    const memosCol = db.collection('memos');
    const initialMemos = [
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

    console.log('Seeding initial memos to memos collection...');
    const memoBatch = db.batch();
    for (const memo of initialMemos) {
      const docRef = memosCol.doc(memo.id);
      memoBatch.set(docRef, memo);
    }
    await memoBatch.commit();
    console.log('Memos collection seeding completed!');
    
    console.log('Firestore initialization complete!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
}

initFirestore();
