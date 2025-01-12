import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ValkibotGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private users = new Map<string, { socket: Socket; isAdmin: boolean }>();
  
    
    handleConnection(client: Socket): void {
      const { isAdmin } = client.handshake.query;
      if (isAdmin === undefined) {
        console.log('isAdmin recibido:', isAdmin);
        console.log(`Cliente rechazado: ${client.id} (isAdmin no definido)`);
        client.disconnect(); 
        return;
      }
  
      
      this.users.set(client.id, { socket: client, isAdmin: isAdmin === 'true' });
  
      console.log(`Cliente conectado: ${client.id}, Admin: ${isAdmin}`);
      console.log('Usuarios actuales:', Array.from(this.users.keys()));
    }
  
    
    handleDisconnect(client: Socket): void {
      this.users.delete(client.id);
      console.log(`Cliente desconectado: ${client.id}`);
      console.log('Usuarios restantes:', Array.from(this.users.keys()));
    }
  
    
    @SubscribeMessage('chatToServer')
    handleMessage(
      @MessageBody() body: { senderId: string; message: string },
      @ConnectedSocket() client: Socket,
    ): void {
      const sender = this.users.get(client.id);
      if (!sender) {
        console.log(`Mensaje rechazado: Cliente no encontrado (${client.id})`);
      return;
      }
      const { isAdmin } = sender;
      console.log(`Mensaje recibido de ${isAdmin ? 'Admin' : 'Usuario'} (${client.id}):`, body);
  
      if (isAdmin) {
        
        const targetUser = Array.from(this.users.values()).find((u) => !u.isAdmin);
        if (targetUser) {
          console.log(`Enviando mensaje al usuario (${targetUser.socket.id}):`, body);
          targetUser.socket.emit('chatToClient', {
            sender: 'Admin',
            message: body,
            
          });
        } else {
          console.log('No hay usuarios conectados.');
          client.emit('chatToClient', { sender: 'Sistema', message: 'No hay usuarios conectados.' });
        }
      } else {
        
        const admin = Array.from(this.users.values()).find((u) => u.isAdmin);
        if (admin) {
          console.log(`Enviando mensaje al admin (${admin.socket.id}):`, body)
          admin.socket.emit('chatToClient', {
            sender: 'Usuario',
            message: body
          });
        } else {
          console.log('No hay administradores conectados.');
          client.emit('chatToClient', { sender: 'Sistema', message: 'No hay administradores disponibles.' });
        }
      }
    }
  }