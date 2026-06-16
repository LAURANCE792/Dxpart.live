import axios from 'axios';

const DERIV_WS_URL = process.env.DERIV_WS_URL || 'wss://ws.binaryws.com/websockets/v3';
const DERIV_APP_ID = process.env.DERIV_APP_ID;

class DerivWebSocketClient {
  private ws: WebSocket | null = null;
  private messageId: number = 1;
  private callbacks: Map<number, (data: any) => void> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(DERIV_WS_URL);

        this.ws.onopen = () => {
          console.log('Connected to Deriv WebSocket');
          this.reconnectAttempts = 0;
          this.authorize();
          resolve();
        };

        this.ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          console.log('Deriv WebSocket Response:', response);

          if (response.req_id) {
            const callback = this.callbacks.get(response.req_id);
            if (callback) {
              callback(response);
              this.callbacks.delete(response.req_id);
            }
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Disconnected from Deriv WebSocket');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private authorize() {
    const authToken = process.env.DERIV_API_TOKEN;
    const message = {
      authorize: authToken,
      req_id: this.messageId++
    };
    this.send(message);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Failed to reconnect after max attempts');
    }
  }

  private send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  async getActiveSymbols(): Promise<any> {
    return new Promise((resolve) => {
      const reqId = this.messageId++;
      this.callbacks.set(reqId, resolve);
      this.send({
        active_symbols: 'brief',
        req_id: reqId
      });
    });
  }

  async getTicks(symbol: string): Promise<any> {
    return new Promise((resolve) => {
      const reqId = this.messageId++;
      this.callbacks.set(reqId, resolve);
      this.send({
        ticks: symbol,
        subscribe: 1,
        req_id: reqId
      });
    });
  }

  async buy(params: any): Promise<any> {
    return new Promise((resolve) => {
      const reqId = this.messageId++;
      this.callbacks.set(reqId, resolve);
      this.send({
        buy: 1,
        ...params,
        req_id: reqId
      });
    });
  }

  async sell(contractId: string): Promise<any> {
    return new Promise((resolve) => {
      const reqId = this.messageId++;
      this.callbacks.set(reqId, resolve);
      this.send({
        sell: contractId,
        price: 0,
        req_id: reqId
      });
    });
  }

  async getContractDetails(contractId: string): Promise<any> {
    return new Promise((resolve) => {
      const reqId = this.messageId++;
      this.callbacks.set(reqId, resolve);
      this.send({
        portfolio: 1,
        req_id: reqId
      });
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new DerivWebSocketClient();
