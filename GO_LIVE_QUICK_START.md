# Step-by-Step: Go Live on Any Browser

## Quick Start (5 Minutes)

### 1. **Get Your Deriv API Token**
   - Visit: https://app.deriv.com/account/api-token
   - Click "Create Token"
   - Select scopes: read, trade
   - Copy the token

### 2. **Update Environment Variables**
   ```bash
   # backend/.env
   DERIV_API_TOKEN=your_token_here
   DERIV_APP_ID=your_app_id_here
   ```

### 3. **Deploy on Vercel (Frontend - 2 minutes)**
   ```bash
   npm install -g vercel
   vercel
   ```
   - Select your repo
   - Add env variable: `NEXT_PUBLIC_API_URL=your-backend-url`
   - Done! Your site is live at `something.vercel.app`

### 4. **Deploy Backend on Railway (3 minutes)**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repo
   - Add environment variables
   - Railway auto-deploys!

### 5. **Access Your Platform**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-app.railway.app`

---

## Summary

| Component | Deploy | Time | Cost |
|-----------|--------|------|------|
| Frontend | Vercel | 2 min | Free |
| Backend | Railway | 2 min | Free tier available |
| Database | MongoDB Atlas | 2 min | Free tier |
| Domain | Namecheap | 5 min | ~$5/year |

**Total time to go live: ~15 minutes**
**Total cost: ~$5/year (optional domain)**

