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


  private users = new Map<string, { socket: Socket; isAdmin: boolean; firstname: string }>();

  handleConnection(client: Socket): void {
    const { isAdmin, firstname } = client.handshake.query;  
    if (isAdmin === undefined || !firstname) {
      console.log('isAdmin o firstname no recibido');
      console.log(`Cliente rechazado: ${client.id} (isAdmin o firstname no definidos)`);
      client.disconnect();
      return;
    }

    const firstNameString = Array.isArray(firstname) ? firstname[0] : firstname;

    this.users.set(client.id, { socket: client, isAdmin: isAdmin === 'true', firstname: firstNameString });

    console.log(`Cliente conectado: ${client.id}, Admin: ${isAdmin}, Firstname: ${firstname}`);
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
    const { isAdmin, firstname } = sender; 
    console.log(`Mensaje recibido de ${isAdmin ? 'Admin' : 'Usuario'} (${firstname}):`, body);

    if (isAdmin) {
      const targetUser = Array.from(this.users.values()).find((u) => !u.isAdmin);
      if (targetUser) {
        console.log(`Enviando mensaje al usuario (${targetUser.socket.id}):`, body);
        targetUser.socket.emit('chatToClient', {
          sender: 'Admin' + firstname, 
          message: body.message,
        });
      } else {
        console.log('No hay usuarios conectados.');
        client.emit('chatToClient', { sender: 'Sistema', message: 'No hay usuarios conectados.' });
      }
    } else {
      const admin = Array.from(this.users.values()).find((u) => u.isAdmin);
      if (admin) {
        console.log(`Enviando mensaje al admin (${admin.socket.id}):`, body);
        admin.socket.emit('chatToClient', {
          sender: firstname,
          message: body.message,
        });
      } else {
        console.log('No hay administradores conectados.');
        client.emit('chatToClient', { sender: 'Sistema', message: 'No hay administradores disponibles.' });
      }
    }
  }
}
