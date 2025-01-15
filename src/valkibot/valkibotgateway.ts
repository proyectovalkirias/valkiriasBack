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
import { ValkibotService } from './valkibot.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ValkibotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  private users = new Map<string, { socket: Socket; isAdmin: boolean; firstname: string }>();
  constructor(private valkibotService: ValkibotService) {}

  handleConnection(client: Socket): void {
    const { isAdmin, firstname, userId } = client.handshake.query;  
    if (isAdmin === undefined || !firstname) {
      console.log('isAdmin, firstname, userId no recibido');
      console.log(`Cliente rechazado: ${client.id} (userId, isAdmin o firstname no definidos)`);
      client.disconnect();
      return;
    }

    const firstNameString = Array.isArray(firstname) ? firstname[0] : firstname;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;

    

    this.users.set(client.id, { socket: client, isAdmin: isAdmin === 'true', firstname: firstNameString });

    this.valkibotService.createChatLog(userIdString);

    console.log(`Cliente conectado: ${client.id}, Admin: ${isAdmin}, Firstname: ${firstname}`);
    console.log('Usuarios actuales:', Array.from(this.users.keys()));
  }

  handleDisconnect(client: Socket): void {
    this.users.delete(client.id);
    console.log(`Cliente desconectado: ${client.id}`);
    console.log('Usuarios restantes:', Array.from(this.users.keys()));

    const user = this.users.get(client.id);
    if (user) {
      this.valkibotService.closeChat(user.firstname);
    }
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(
    @MessageBody() body: { sender: string; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sender = this.users.get(client.id);
    if (!sender) {
      console.log(`Mensaje rechazado: Cliente no encontrado (${client.id})`);
      return;
    }
    const { isAdmin, firstname } = sender; 
    const userId = sender.socket.handshake.query.userId;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;


    if (typeof userIdString !== 'string') {
      throw new Error('El userId no es una cadena válida.');
    }   
    console.log(`Mensaje recibido de ${firstname ? 'Admin' : 'Usuario'}:`, body);

    
    await this.valkibotService.addMessageToChatLog(userIdString, {sender: body.sender, content: body.content });

    

    if (isAdmin) {
      const targetUser = Array.from(this.users.values()).find((u) => !u.isAdmin);
      if (targetUser) {
        console.log(`Enviando mensaje al usuario (${targetUser.socket.id}):`, body);
        targetUser.socket.emit('chatToClient', {
          sender: 'Admin' + firstname, 
          message: body.content,
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
          message: body.content,
        });
      } else {
        console.log('No hay administradores conectados.');
        client.emit('chatToClient', { sender: 'Sistema', message: 'No hay administradores disponibles.' });
      }
    }
  }
}
