import { generateQueryResponse } from './lib/gemini.js';

(async () => {
  try {
    const res = await generateQueryResponse("What is the AQI?", []);
    console.log(res);
  } catch (e) {
    console.error("ERROR:", e);
  }
})();
