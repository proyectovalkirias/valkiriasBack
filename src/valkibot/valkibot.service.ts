import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatLog } from 'src/entities/chatLog.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValkibotService {
  constructor(
    @InjectRepository(ChatLog)
    private chatLogRepository: Repository<ChatLog>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private options = {
    inicio: [
      { id: 'productos', label: '¿Que ofrecemos?' },
      { id: 'formasdepago', label: '¿Que formas de pago aceptamos?' },
      { id: 'envios', label: 'Envios y Entregas' },
      { id: 'talles', label: 'Talles y Colores' },
      { id: 'pedidosespeciales', label: 'Combos y Pedidos Especiales' },
      { id: 'chat', label: 'Hablar con un Humano' },
    ],
    productos: [
      { id: 'remeras', label: 'Remeras Estampadas' },
      { id: 'buzos', label: 'Buzos Estampados' },
      { id: 'accesorios', label: 'Gorras y Tazas personalizadas' },
      { id: 'estampas', label: 'Estampas personalizadas' },
    ],
    remeras:
      '¡Ofrecemos remeras estampadas personalizables a tu gusto! Actualmente trabajamos colores blanco, negro y gris. Los talles disponibles son S, M, L, XL y XXL. ¡Tambien tenemos talles para niños! 💕',
    buzos:
      'Nuestros buzos pueden ser cuello redondo o canguro con capucha. Actualmente trabajamos colores blanco, negro y gris Los talles disponibles son S, M, L, XL y XXL. ¡Tambien tenemos talles para niños! 💕',
    accesorios:
      '¿Buscas tazas o gorras personalizadas? Ofrecemos tazas ceramicas y de plastico y gorra estilo trucker. ¡Todo personalizable a tu gusto! 💕',
    formasdepago:
      'Aceptamos Mercado Pago y todas las opciones que ofrece la app (tarjetas de credito, debito, dinero en cuenta, etc.) Si tenés alguna duda sobre cómo pagar, pasá por WhatsApp. 🤑💳',
    estampas:
      'Podes elegir estampas grandes ( hasta tamaño A3) y pequeñas (hasta 12 cm) incluidas en el precio publicado. Si necesitas un tamaño diferente, ¡no dudes en preguntar por whatsapp! ',
    envios:
      'Estamos en Luis Guillón, Zona Sur. Podés:\n' +
      'Coordinar con nosotras para retirar personalmente. 🏃‍♀️\n' +
      'Recibir tu pedido por Correo. 🚚📦\n' +
      'Si necesitás más info sobre costos o tiempos, ¡escribinos por WhatsApp!',
    talles:
      'Nuestras prendas son unisex y trabajamos talles para niños y adultos. Si no ves el color que querés en la web, consultanos por WhatsApp, que vemos qué podemos hacer. 🎨👕',
    whatsapp: 'Si no encontrás lo que buscás o preferís hablar con alguien del equipo, escribinos directamente al WhatsApp. ¡Te esperamos con buena onda y muchas ideas! 🦊💬',
    pedidosespeciales:
      'Hacemos combos de buzos y remeras para egresados y conjuntos deportivos personalizados para fútbol o básquet. 🏀⚽\n' +
      'Por la cantidad de detalles que esto requiere, te recomiendo que consultes directamente por WhatsApp. ¡Hagamos magia juntos! ✨',

      volver: [
        { id: 'inicio', label: 'Volver al menú principal 🦊✨' },
      ],
  };

  async getResponse(
    message: string,
  ): Promise<{ reply: string; options?: { id: string; label: string }[] }> {
    if (!message || typeof message !== 'string') {
      return {
        reply:
          'Por favor, escribí un mensaje válido para que pueda ayudarte. 🦊✨ (Pssst!! Decime "hola"!!)',
      };
    }

    const lowerMessage = message.toLowerCase();

    if (lowerMessage === 'hola' || lowerMessage === 'inicio') {
      return {
        reply:
          '¡Hola, soy Valki! 🦊✨ Soy la guardiana oficial de Valkirias y estoy aquí para ayudarte con cualquier duda que tengas. ¿Qué necesitas saber hoy? 👇',
        options: this.options.inicio,
      };
    }

    if (
      lowerMessage === 'adios' ||
      lowerMessage === 'gracias' ||
      lowerMessage === 'fin'
    ) {
      return {
        reply:
          '¡Espero haberte ayudado, compi! 🦊✨ Si querés saber algo más, estoy aquí. O si no, siempre podés pasar por el WhatsApp. ¡Nos leemos luego!',
      };
    }

    if (lowerMessage === 'productos') {
      return {
        reply:
          '¡Estas son nuestras opciones de productos! Elige lo que más te guste: 👇',
          options: [
            ...this.options.productos,  
            ...this.options.volver,     
          ], 
      };
    }

    if (lowerMessage === 'fer') {
      return {
        reply: 'Fer!  Soy Valki 🦊✨, y con este mensaje te quiero decir que tenes que aprobar a los pibes de Proyecto Valkirias, no se si se lo merecen, pero lo necesitan 💕💕',
        options: this.options.volver,
      };
    }

    if (lowerMessage === 'caro') {
      return {
        reply: 'Caro!  Soy Valki!🦊✨ Y en nombre de los pibes de Proyecto Valkirias me toca decirte: ¡Gracias por todo este proceso de aprendizaje! ¡Te queremos! (Lean ahora, puse este mensaje pregrabado antes de la entrega porque me sobran huevos y se que vamos a aprobar, saludos cordiales!) ',
        options: this.options.volver,
      };  
    }
    const lowerMessageValid = this.options[lowerMessage];
    if (lowerMessageValid) {
      let replyText = lowerMessageValid;
      let responseOptions;
  
      
      if (lowerMessage === 'productos') {
        responseOptions = [
          ...this.options.productos,   
          ...this.options.volver,      
        ];
      } 
     
      else if (
        lowerMessage === 'formasdepago' ||
        lowerMessage === 'envios' ||
        lowerMessage === 'talles' ||
        lowerMessage === 'pedidosespeciales'
      ) {
        responseOptions = [
          ...this.options.volver,  
        ];
      }
      return {
        reply: replyText,
        options: responseOptions, 
      };
    }
  

    if (lowerMessage === 'volver') {
      return {
        reply:
          '¡Volvimos al menú principal! 🦊✨ ¿En qué más puedo ayudarte?',
        options: this.options.inicio,
      };
    }

    if (this.options[lowerMessage]) {
      return { reply: this.options[lowerMessage] };
    }

    if (lowerMessage === 'chat') {
      return {
        reply:
          '¡Te estamos derivando al chat en vivo para que hables con un humano! 💬 Nuestro equipo está listo para ayudarte. 🙌',
        options: [
          ...this.options.volver, 
        ],
      };
    }

    return {
      reply:
        'Escribí "hola" o "inicio" para ver las opciones disponibles o contáctanos por WhatsApp. 🦊✨',
    };
  }


  async createChatLog(userId: string): Promise<ChatLog> {

    const existingChatLog = await this.chatLogRepository.createQueryBuilder('chatLog')
    .leftJoinAndSelect('chatLog.user', 'user')
    .where('chatLog.userId = :userId', { userId })  
    .getOne();

    console.log("REGISTRO DE CHATS:" + existingChatLog);
  
    if (existingChatLog) {
      console.log('Chat log encontrado:', existingChatLog);
      return existingChatLog;
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const chatLog = new ChatLog();
    chatLog.user = user; 
    chatLog.messages = []; 
    chatLog.timestamp = new Date();
    chatLog.isActive = true;
    return this.chatLogRepository.save(chatLog);
  }

  async addMessageToChatLog(userId: string, message: { sender: string; content: string }): Promise<ChatLog> {
    console.log('Mensaje antes de llamar a addMessageToChatLog:', message);
    const chatLog = await this.chatLogRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['user'],
    });

    if (!chatLog) {
      console.log('No se encontró un chat activo para este usuario.');
      return null;
    }
    const { sender, content } = message;
    console.log('Contenido del mensaje:', content);

    const newMessage = { sender, content };

    chatLog.messages = chatLog.messages ? [...chatLog.messages, newMessage] : [newMessage];
    console.log('Contenido del mensaje:', message.content);
    console.log('Mensajes después de agregar:', chatLog.messages);
    chatLog.timestamp = new Date()
    return this.chatLogRepository.save(chatLog); 
  }

  
  async closeChat(userId: string): Promise<ChatLog> {
    const chatLog = await this.chatLogRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['user'],
    });

    if (!chatLog) {
      console.log('No se encontró un chat activo para este usuario.');
      return null;
    }

    chatLog.isActive = false; 
    return this.chatLogRepository.save(chatLog);
  }

  async getMessagesById(userId: string): Promise<ChatLog[]> {

    console.log("Buscando mensajes para userId:", userId);

    const queryBuilder = this.chatLogRepository.createQueryBuilder("chatLog");
  
    const messages = await queryBuilder
      .where("chatLog.userId = :userId", { userId })  
      .orderBy("chatLog.timestamp", "ASC")
      .getMany();

    console.log("Mensajes encontrados:", messages);
    return messages
  }
}

