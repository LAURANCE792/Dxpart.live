# DXPart.live - Deployment & Deriv API Integration Guide

## Part 1: Deriv API Integration

### Step 1: Get Deriv API Credentials

1. Go to [https://app.deriv.com](https://app.deriv.com)
2. Log in or create an account
3. Navigate to **Settings > API tokens**
4. Create a new token with these scopes:
   - `read` - For reading market data
   - `trade` - For placing trades
   - `payments` - For account operations
5. Copy your **App ID** and **API Token**

### Step 2: Configure Backend Environment

Update `backend/.env` with your Deriv credentials:

```env
# Deriv API Configuration
DERIV_APP_ID=your_app_id_here
DERIV_API_URL=https://api.deriv.com
DERIV_WS_URL=wss://ws.binaryws.com/websockets/v3
```

### Step 3: Update Deriv Configuration

Update `backend/src/config/deriv.ts`:

```typescript
class DerivAPI {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket(process.env.DERIV_WS_URL);
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onopen = () => {
      console.log('Connected to Deriv WebSocket');
      this.authorize();
    };

    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('Deriv Response:', response);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  private authorize() {
    const message = {
      authorize: process.env.DERIV_API_KEY
    };
    this.ws.send(JSON.stringify(message));
  }

  async getMarketData(symbol: string) {
    const message = {
      ticks: symbol,
      subscribe: 1
    };
    this.ws.send(JSON.stringify(message));
  }

  async placeTrade(params: any) {
    const message = {
      buy: 1,
      ...params
    };
    this.ws.send(JSON.stringify(message));
  }
}
```

### Step 4: Update Backend Index

Add Deriv integration to `backend/src/index.ts`:

```typescript
import DerivAPI from './config/deriv';

const derivAPI = new DerivAPI();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Listen for market data requests
  socket.on('subscribe_market', (symbol) => {
    derivAPI.getMarketData(symbol);
    socket.emit('market_update', { symbol, data: 'live data' });
  });

  socket.on('place_trade', (tradeData) => {
    derivAPI.placeTrade(tradeData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
```

---

## Part 2: Frontend Deriv Connection

### Step 1: Install Socket.io Client

```bash
cd frontend
npm install socket.io-client
```

### Step 2: Create WebSocket Hook

Create `frontend/app/hooks/useSocket.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
      console.log('Connected to backend');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
```

### Step 3: Create Market Data Component

Create `frontend/app/components/LiveMarket.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/app/hooks/useSocket';

interface MarketPrice {
  symbol: string;
  price: number;
  change: number;
}

export default function LiveMarket() {
  const { socket, isConnected } = useSocket();
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Subscribe to market updates
    socket.emit('subscribe_market', 'EURUSD');
    socket.emit('subscribe_market', 'GBPUSD');
    socket.emit('subscribe_market', 'USDJPY');

    // Listen for updates
    socket.on('market_update', (data: MarketPrice) => {
      setPrices(prev => {
        const index = prev.findIndex(p => p.symbol === data.symbol);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      socket.off('market_update');
    };
  }, [socket]);

  return (
    <div className="bg-secondary/50 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Live Markets</h2>
      <div className="space-y-2">
        {prices.map(price => (
          <div key={price.symbol} className="flex justify-between items-center p-3 bg-primary/50 rounded">
            <span className="font-semibold text-white">{price.symbol}</span>
            <div className="text-right">
              <div className="text-white font-bold">${price.price.toFixed(5)}</div>
              <div className={price.change > 0 ? 'text-green-400' : 'text-red-400'}>  
                {price.change > 0 ? '+' : ''}{price.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
    </div>
  );
}
```

---

## Part 3: Deployment Options

### Option 1: Deploy on Vercel (Recommended for Frontend)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin develop
```

#### Step 2: Deploy Frontend on Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub account and select `Dxpart.live`
4. Select "frontend" as root directory
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.com`
6. Click "Deploy"

### Option 2: Deploy Backend on Railway/Render

#### Using Railway:
1. Go to [https://railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select "backend" directory
5. Add environment variables from `.env`
6. Railway will auto-deploy on push

#### Using Render:
1. Go to [https://render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Set Start Command: `npm run build && npm start`
5. Add environment variables
6. Deploy

### Option 3: Deploy with Docker on AWS/DigitalOcean

#### DigitalOcean App Platform:
1. Go to [https://www.digitalocean.com](https://www.digitalocean.com)
2. Apps → Create App → Connect Repository
3. Select `Dxpart.live` repository
4. Configure services:
   - Frontend (port 3000)
   - Backend (port 5000)
   - MongoDB (managed database)
5. Set environment variables
6. Deploy

### Option 4: Deploy on VPS (AWS EC2 / DigitalOcean Droplet)

#### Step 1: Create VPS Instance
```bash
# SSH into your VPS
ssh root@your_vps_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Clone and Deploy
```bash
# Clone repository
git clone https://github.com/LAURANCE792/Dxpart.live.git
cd Dxpart.live

# Create production .env files
cp .env.example .env.prod
cp backend/.env.example backend/.env.prod
cp frontend/.env.example frontend/.env.prod

# Update environment variables with production values
nano .env.prod
nano backend/.env.prod
nano frontend/.env.prod

# Build and run with Docker
sudo docker-compose -f docker-compose.yml up -d
```

#### Step 3: Setup Domain & SSL
```bash
# Install Nginx
sudo apt install nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx

# Get SSL Certificate
sudo certbot certonly --nginx -d yourdomain.com

# Create Nginx config at /etc/nginx/sites-available/dxpart
sudo nano /etc/nginx/sites-available/dxpart
```

Add this Nginx configuration:

```nginx
upstream backend {
  server 127.0.0.1:5000;
}

upstream frontend {
  server 127.0.0.1:3000;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

```bash
# Enable Nginx config
sudo ln -s /etc/nginx/sites-available/dxpart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Part 4: Go Live Checklist

- [ ] Get Deriv API credentials
- [ ] Update backend `.env` with Deriv credentials
- [ ] Test Deriv API connection locally
- [ ] Update frontend `.env` with production API URL
- [ ] Build frontend: `npm run build`
- [ ] Test locally: `npm run dev`
- [ ] Push to GitHub
- [ ] Deploy frontend (Vercel/Railway/VPS)
- [ ] Deploy backend (Railway/Render/VPS)
- [ ] Connect custom domain
- [ ] Setup SSL certificate
- [ ] Test live functionality
- [ ] Enable monitoring and logging
- [ ] Setup backup strategy for database

---

## Part 5: Useful Commands

```bash
# Check Docker containers
sudo docker ps

# View logs
sudo docker logs dxpart-backend
sudo docker logs dxpart-frontend

# Restart services
sudo docker-compose restart

# Stop services
sudo docker-compose down

# Update and restart
git pull
sudo docker-compose up -d --build
```

---

## Support

For issues:
1. Check GitHub Issues: https://github.com/LAURANCE792/Dxpart.live/issues
2. Check Deriv API Docs: https://developers.deriv.com/
3. Check backend logs: `docker logs dxpart-backend`
4. Check frontend logs: `docker logs dxpart-frontend`

