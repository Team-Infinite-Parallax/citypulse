// Force the backend into offline fallback mode for tests so results are
// deterministic and no live GCP calls (Vertex, Firestore, BigQuery) are
// attempted. dotenv does not override variables that already exist, so
// setting them here wins over backend/.env.
process.env.GCP_PROJECT_ID = '';
process.env.GOOGLE_CLOUD_PROJECT = '';
process.env.USE_BIGQUERY = 'false';
process.env.USE_FIRESTORE = 'false';
process.env.USE_ALLOYDB = 'false';
