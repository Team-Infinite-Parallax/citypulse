# Frontend Requirements

This file documents the requirements to run, build, and deploy the CityPulse frontend application.

## Runtime & Engine Requirements
*   **Node.js**: `v18.17.0` or higher (configured in `package.json` under `engines`).
*   **NPM**: standard NPM CLI packaged with Node.

## Environment Variables
The application requires the following environment variables during build time and runtime:

| Variable Name | Required | Description | Example Value |
|---|---|---|---|
| `PUBLIC_API_URL` | Yes (in production) | The base URL of the running backend Express API service. | `https://citypulse-backend.onrender.com` |

> [!NOTE]
> During local development, if `PUBLIC_API_URL` is omitted, Astro will automatically proxy `/api` requests to `http://localhost:3001` based on the configuration in `astro.config.mjs`.

## Build & Development Commands
*   **Install Dependencies**: `npm install`
*   **Local Development Server**: `npm run dev` (starts the dev server on `http://localhost:4321`)
*   **Production Build**: `npm run build` (compiles pages and bundles serverless entrypoints in `.vercel/output`)
*   **Preview Build**: `npm run preview` (locally previews the built production assets)

## Deploy Target Requirements
*   **Target Platform**: Vercel
*   **Framework Preset**: Astro
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist` (static files are moved automatically to `.vercel/output/static` by `@astrojs/vercel`)
*   **Node Version on Vercel**: Node.js `22.x` or `20.x`
