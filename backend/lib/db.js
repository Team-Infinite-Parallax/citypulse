import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BigQuery } from '@google-cloud/bigquery';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'traffic.json');

const bigquery = new BigQuery();
const DATASET_ID = 'citypulse';
const TABLE_ID = 'traffic';

let useBigQuery = process.env.USE_BIGQUERY === 'true';

export const getTrafficData = async () => {
  if (useBigQuery) {
    try {
      const query = `SELECT * FROM \`${bigquery.projectId}.${DATASET_ID}.${TABLE_ID}\` ORDER BY timestamp DESC LIMIT 1000`;
      const options = {
        query: query,
        location: 'US', 
      };
      const [job] = await bigquery.createQueryJob(options);
      const [rows] = await job.getQueryResults();
      return rows;
    } catch (err) {
      console.error("BigQuery query failed, falling back to JSON:", err.message);
    }
  }

  // Fallback to JSON
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return [];
  }
};
