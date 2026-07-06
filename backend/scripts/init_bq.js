import { BigQuery } from '@google-cloud/bigquery';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'traffic.json');

async function initBQ() {
  const bigquery = new BigQuery();
  const datasetId = 'citypulse';
  const tableId = 'traffic';

  console.log(`Setting up BigQuery dataset ${datasetId} and table ${tableId}...`);

  try {
    const [dataset] = await bigquery.createDataset(datasetId, {
        location: 'US',
    }).catch(err => {
        if(err.code === 409) return bigquery.dataset(datasetId).get();
        throw err;
    });
    console.log(`Dataset ${dataset.id} created or exists.`);

    const schema = [
      { name: 'route_name', type: 'STRING' },
      { name: 'timestamp', type: 'TIMESTAMP' },
      { name: 'congestion', type: 'INTEGER' },
      { name: 'delay_minutes', type: 'INTEGER' },
      { name: 'notes', type: 'STRING' },
      { name: 'aqi', type: 'INTEGER' },
    ];

    const [table] = await dataset.createTable(tableId, { schema }).catch(err => {
        if(err.code === 409) return dataset.table(tableId).get();
        throw err;
    });
    console.log(`Table ${table.id} created or exists.`);

    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    
    // insert data in batches if needed, but for < 1000 records, a single insert is fine
    console.log(`Uploading ${data.length} records to BigQuery...`);
    await table.insert(data);
    console.log('Data upload complete!');

  } catch (error) {
    console.error('Error setting up BigQuery:', error);
  }
}

initBQ();
