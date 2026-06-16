# DXPart.live - Complete Production Deployment Guide

## 🌍 Make Your Platform Public & Live 24/7

---

## STEP 1: Buy a Custom Domain ($5-15/year)

### Option A: Namecheap (Cheapest)
1. Go to https://www.namecheap.com
2. Search for your domain (e.g., `dxpart.live`, `tradingbot.live`)
3. Add to cart → Checkout
4. Select **2-year plan** for discount
5. Complete payment
6. **Important:** Copy your nameservers

### Option B: GoDaddy, Bluehost, HostGator
- Similar process
- Usually more expensive ($12-20/year)

---

## STEP 2: Deploy Frontend on Vercel (FREE TIER)

Vercel is the **easiest way** to deploy Next.js apps.

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
# Opens browser → Sign up with GitHub → Authorize
```

### 2.3 Deploy Frontend
```bash
cd frontend
vercel
# Questions:
# ? Set up and deploy? Yes
# ? Link to existing project? No
# ? Project name? dxpart-live
# ? Directory? ./
# Wait 1-2 minutes...
```

**Result:** Your app is now at `dxpart-live.vercel.app` ✅

### 2.4 Add Custom Domain to Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your custom domain (e.g., `dxpart.live`)
5. Vercel gives you **nameservers** to add

---

## STEP 3: Connect Domain to Vercel

### At Your Domain Registrar (Namecheap):
1. Log in to Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to your domain
4. Go to **Nameservers** tab
5. Select **Custom DNS**
6. Add Vercel's nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ```
7. Save

**Wait 24-48 hours for DNS propagation**

---

## STEP 4: Deploy Backend on Railway or Render

### Option A: Railway (Recommended - $5/month)

#### 4.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

#### 4.2 Deploy Backend
1. Click **New Project**
2. Select **Deploy from GitHub**
3. Select your `Dxpart.live` repository
4. Railway detects it's a monorepo
5. Create service for backend:
   - Name: `dxpart-backend`
   - Root directory: `backend`
   - Start command: `npm run build && npm start`

#### 4.3 Add Database (MongoDB)
1. Click **Add** in Railway dashboard
2. Select **MongoDB**
3. Railway creates MongoDB for you (FREE!)
4. Copy connection string

#### 4.4 Add Environment Variables
1. Go to backend service settings
2. Add variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key-here
   DERIV_API_TOKEN=your-token
   DERIV_APP_ID=your-app-id
   PORT=5000
   ```
3. Deploy

**Result:** Your backend is now at `railway-project-name.railway.app` ✅

### Option B: Render (Alternative - FREE tier available)

1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Select your repository
5. Configure:
   - Name: `dxpart-backend`
   - Root directory: `backend`
   - Build command: `npm run build`
   - Start command: `npm start`
6. Add environment variables
7. Deploy (Free tier has 0.5GB RAM - limited but works)

---

## STEP 5: Connect Frontend to Backend

### Update Frontend Environment Variables

```bash
# frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-backend-railway.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-railway.railway.app
```

### Deploy Updated Frontend
```bash
cd frontend
vercel --prod
```

---

## STEP 6: Update Backend CORS & Security

### backend/src/index.ts
```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://dxpart.live',
    'https://www.dxpart.live',
    'https://dxpart-live.vercel.app'
  ],
  credentials: true
}));
```

### Redeploy Backend
```bash
git add .
git commit -m "Update CORS for production"
git push origin develop
# Railway auto-redeploys from GitHub
```

---

## STEP 7: Setup Database Backups (MongoDB Atlas)

### 7.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (FREE tier available!)
3. Create cluster:
   - Cloud provider: AWS
   - Region: Closest to you
   - Tier: M0 (FREE)

### 7.2 Create Connection String
1. In Atlas, go to **Connect**
2. Select **Connect Your Application**
3. Copy connection string
4. Use in Railway environment variable

### 7.3 Enable Backups
1. Go to **Backup** in Atlas
2. Enable **Continuous Backups** (FREE)

---

## STEP 8: Setup Email Notifications (SendGrid - FREE)

For user alerts and trade notifications:

### 8.1 Create SendGrid Account
1. Go to https://sendgrid.com
2. Sign up (FREE tier: 100 emails/day)
3. Create API key

### 8.2 Add to Backend
```bash
cd backend
npm install @sendgrid/mail
```

### 8.3 Create Email Service
```typescript
// backend/src/services/emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendTradeAlert = async (email: string, tradeData: any) => {
  try {
    await sgMail.send({
      to: email,
      from: 'alerts@dxpart.live',
      subject: `Trade Alert: ${tradeData.symbol}`,
      html: `<h1>Trade Executed</h1><p>Your bot has executed a ${tradeData.type} trade on ${tradeData.symbol}</p>`
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};
```

---

## STEP 9: Setup Monitoring & Analytics

### Option A: Sentry (Error Tracking - FREE)
1. Go to https://sentry.io
2. Sign up
3. Create project for both frontend & backend
4. Add Sentry SDK to track errors

### Option B: UptimeRobot (Uptime Monitoring - FREE)
1. Go to https://uptimerobot.com
2. Add monitors for your domain
3. Get alerts if site goes down

### Option C: Google Analytics (Traffic - FREE)
1. Go to https://analytics.google.com
2. Create account
3. Add tracking code to frontend

---

## STEP 10: Final Checklist Before Launch

```
✅ Domain registered and connected
✅ Frontend deployed on Vercel
✅ Backend deployed on Railway/Render
✅ Database setup (MongoDB)
✅ Environment variables configured
✅ SSL/HTTPS enabled (automatic)
✅ CORS configured
✅ Deriv API token added
✅ Backups enabled
✅ Monitoring setup
✅ Tested on multiple browsers
✅ Mobile responsive tested
✅ API endpoints tested
✅ WebSocket connection tested
```

---

## STEP 11: Launch! 🚀

### Access Your Live Platform
```
🌐 Website: https://dxpart.live
📱 Works on: Desktop, Tablet, Mobile
🔒 Secure: HTTPS enabled
⚡ Fast: CDN cached on Vercel
🌍 Global: Accessible from anywhere
```

### Tell Your Users
1. Share link: `https://dxpart.live`
2. They can access anytime, anywhere
3. Sign up → Create bot → Start trading

---

## 💰 Total Monthly Cost

| Service | Cost | Notes |
|---------|------|-------|
| Domain | $0.42/month | ~$5/year |
| Frontend (Vercel) | FREE | Up to 100GB/month |
| Backend (Railway) | ~$5/month | Or free tier |
| Database (MongoDB) | FREE | Atlas free tier |
| Email (SendGrid) | FREE | 100 emails/day |
| **Total** | **~$5/month** | Can start FREE |

---

## 🔧 Troubleshooting

### Website Won't Load
1. Check DNS propagation: https://dnschecker.org
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check Vercel deployment logs
4. Check Railway backend logs

### API Not Working
1. Check CORS configuration
2. Check environment variables
3. Check MongoDB connection
4. Check Deriv API token validity

### Performance Issues
1. Enable Vercel CDN caching
2. Optimize database queries
3. Enable Redis caching on Railway
4. Use database indexes

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Docs: https://docs.mongodb.com
- Deriv API: https://developers.deriv.com

---

## ✨ Result

**Your platform is now:**
- ✅ Live on the Internet
- ✅ Accessible 24/7 from any browser
- ✅ Works on desktop, mobile, tablet
- ✅ Secure with HTTPS
- ✅ Fast with global CDN
- ✅ Scalable for growth
- ✅ Professional domain
- ✅ Real-time trading with Deriv

**Anyone can visit `https://dxpart.live` and start trading! 🎉**

