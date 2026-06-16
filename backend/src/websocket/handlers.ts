import { Socket } from 'socket.io';
import { Server } from 'http';
import DerivWebSocket from '../services/derivWebSocket';

export const setupSocketHandlers = (io: any) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Real-time market data
    socket.on('subscribe_market', async (symbol: string) => {
      try {
        const tickData = await DerivWebSocket.getTicks(symbol);
        socket.emit('market_update', tickData);
      } catch (error) {
        console.error('Error subscribing to market:', error);
        socket.emit('error', 'Failed to subscribe to market');
      }
    });

    // Place trade
    socket.on('place_trade', async (tradeData: any) => {
      try {
        const response = await DerivWebSocket.buy(tradeData);
        socket.emit('trade_placed', response);
      } catch (error) {
        console.error('Error placing trade:', error);
        socket.emit('error', 'Failed to place trade');
      }
    });

    // Close trade
    socket.on('close_trade', async (contractId: string) => {
      try {
        const response = await DerivWebSocket.sell(contractId);
        socket.emit('trade_closed', response);
      } catch (error) {
        console.error('Error closing trade:', error);
        socket.emit('error', 'Failed to close trade');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
