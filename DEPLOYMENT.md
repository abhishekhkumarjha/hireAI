# Production Deployment Guide — HireAI

This guide contains step-by-step instructions for deploying HireAI to **Render** and **Vercel**.

There are two primary methods for deploying the application:
1. **Option A: Unified Deployment (Recommended)** — Host both the frontend client and backend server on a single **Render Web Service**. This is the simplest option, avoiding CORS setup and proxy configs.
2. **Option B: Separated Deployment** — Host the React SPA on **Vercel** and the Express API server on **Render**.

---

## Environment Variables Reference

Configure these variables in your deployment dashboards:

| Variable Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes (for Production) | `production` | Set to `production` in production hosting environments. |
| `PORT` | Yes (on Server) | `3000` | Port on which the Express server listens. Automatically assigned by Render. |
| `GEMINI_API_KEY` | Optional | *None* | Your Gemini AI API Key from Google AI Studio. If omitted, the portal operates using offline fallback algorithms. |
| `VITE_API_URL` | Yes (Vercel Frontend only) | *None* | Absolute URL of the backend API server hosted on Render (e.g., `https://your-backend.onrender.com`). |
| `MONGODB_URI` | Optional | *None* | The MongoDB connection URI string for your MongoDB Atlas cluster (enables persistent storage and takes priority). |
| `UPSTASH_REDIS_REST_URL` | Optional | *None* | The REST API URL for your Upstash Redis database (enables persistent storage fallback). |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | *None* | The REST API read/write token for your Upstash Redis database (enables persistent storage fallback). |

---

## Option A: Unified Deployment on Render (Recommended)

In this setup, the Node.js Express server builds the Vite frontend and serves the resulting static assets directly in production.

### Step-by-Step Instructions:

1. **Push Changes to GitHub**:
   Ensure all changes are pushed to your GitHub repository.

2. **Deploy on Render**:
   - Log into [Render](https://render.com/).
   - Click **New +** and select **Blueprint**.
   - Connect your GitHub repository containing the HireAI project.
   - Render will read the `render.yaml` file automatically and configure a Web Service.
   - **Alternatively (Manual Setup)**:
     - Click **New +** and select **Web Service**.
     - Connect your repository.
     - Select **Runtime**: `Node`.
     - Set the **Build Command**: `npm install && npm run build`
     - Set the **Start Command**: `npm run start` (or `node dist/server.cjs`)
     - Under **Environment Variables**, add:
       - `NODE_ENV` = `production`
       - `GEMINI_API_KEY` = *[Your Google AI Studio Key]*
   - Click **Deploy Web Service**.

---

## Option B: Separated Deployment (Vercel Frontend + Render Backend)

Use this option if you want to take advantage of Vercel's Edge network for serving the React SPA frontend, while maintaining the Express server on Render.

### Part 1: Deploy Backend on Render

1. Log into [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your repository.
4. Select **Runtime**: `Node`.
5. Configure settings:
   - **Build Command**: `npm install && npm run build` (This compiles the server executable into `dist/server.cjs`)
   - **Start Command**: `node dist/server.cjs`
6. Under **Environment Variables**:
   - Add `NODE_ENV` = `production`
   - Add `GEMINI_API_KEY` = *[Your Google AI Studio Key]*
7. Click **Deploy Web Service** and wait for it to complete. Note down your backend URL (e.g., `https://hire-ai-backend.onrender.com`).

### Part 2: Deploy Frontend on Vercel

1. Log into [Vercel](https://vercel.com/).
2. Click **Add New** and select **Project**.
3. Import your GitHub repository.
4. Vercel should auto-detect **Vite** as the framework:
   - **Build Command**: `npm run build` or `vite build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend-url.onrender.com` (replace with your actual Render URL from Part 1).
6. Click **Deploy**. Vercel will read the `vercel.json` file in the root directory to handle Single Page App routing automatically.

---

## Database Persistence Setup (Free Tier)

To prevent data loss when your deployment container restarts or sleeps, configure a persistent cloud database. You can use either **MongoDB Atlas** (recommended, takes precedence) or **Upstash Redis**.

### Option 1: MongoDB Atlas (Recommended)

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (M0 Free Tier).
3. Under **Security > Database Access**, create a database user with read/write permissions.
4. Under **Security > Network Access**, add `0.0.0.0/0` to allow connections from Render.
5. In your cluster dashboard, click **Connect** and select **Drivers**.
6. Copy the connection URI string. It should look like:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/hire_ai?retryWrites=true&w=majority`
7. Add this string as `MONGODB_URI` in the environment variables of your hosting dashboard. The application will detect this and automatically migrate the state.

### Option 2: Upstash Redis (Fallback)

To prevent data loss when Render restarts or goes to sleep, set up a free Upstash Redis database:

1. Go to [Upstash](https://upstash.com/) and sign up for a free account.
2. Create a new **Redis** database (select a region close to your Render deployment).
3. Under the **REST API** section of your Upstash Console, copy the following details:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**
4. Add these two variables under the environment variables of your Render Web Service. The application will detect these variables and automatically shift from local file storage (`db.json`) to the free persistent Upstash cloud instance.

