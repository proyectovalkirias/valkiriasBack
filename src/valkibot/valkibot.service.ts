import { Injectable } from '@nestjs/common';

@Injectable()
export class ValkibotService {

    private options = {
        inicio: [
            {id: 'productos', label: '¿Que ofrecemos?'},
            {id: 'formasdepago', label: '¿Que formas de pago aceptamos?'},
            {id: 'envios', label: 'Envios y Entregas'},
            {id: 'talles', label: 'Talles y Colores'},
            {id: 'pedidosespeciales', label: 'Combos y Pedidos Especiales'},
            {id: 'chat', label: 'Hablar con un Humano'}
        ],
        productos: [
            {id: 'remeras', label: 'Remeras Estampadas'},
            {id: 'buzos', label: 'Buzos Estampados'},
            {id: 'accesorios', label: 'Gorras y Tazas personalizadas'}, 
            {id: 'estampas', label: 'Estampas personalizadas'}
        ],
        remeras: "¡Ofrecemos remeras estampadas personalizables a tu gusto! Actualmente trabajamos colores blanco, negro y gris. Los talles disponibles son S, M, L, XL y XXL. ¡Tambien tenemos talles para niños! 💕",
        buzos: "Nuestros buzos pueden ser cuello redondo o canguro con capucha. Actualmente trabajamos colores blanco, negro y gris Los talles disponibles son S, M, L, XL y XXL. ¡Tambien tenemos talles para niños! 💕",
        accesorios: "¿Buscas tazas o gorras personalizadas? Ofrecemos tazas ceramicas y de plastico y gorra estilo trucker. ¡Todo personalizable a tu gusto! 💕",
        formasdepago: "Aceptamos Mercado Pago y todas las opciones que ofrece la app (tarjetas de credito, debito, dinero en cuenta, etc.) Si tenés alguna duda sobre cómo pagar, pasá por WhatsApp. 🤑💳",
        estampas: "Podes elegir estampas grandes ( hasta tamaño A3) y pequeñas (hasta 12 cm) incluidas en el precio publicado. Si necesitas un tamaño diferente, ¡no dudes en preguntar por whatsapp! ",
        envios:  "Estamos en Luis Guillón, Zona Sur. Podés:\n" +
            "Coordinar con nosotras para retirar personalmente. 🏃‍♀️\n" +
            "Recibir tu pedido por Correo. 🚚📦\n" +
            "Si necesitás más info sobre costos o tiempos, ¡escribinos por WhatsApp!",
        talles: "Nuestras prendas son unisex y trabajamos talles para niños y adultos. Si no ves el color que querés en la web, consultanos por WhatsApp, que vemos qué podemos hacer. 🎨👕",
        chat: "Si no encontrás lo que buscás o preferís hablar con alguien del equipo, escribinos directamente al WhatsApp. ¡Te esperamos con buena onda y muchas ideas! 🦊💬",
        pedidosespeciales: "Hacemos combos de buzos y remeras para egresados y conjuntos deportivos personalizados para fútbol o básquet. 🏀⚽\n" +
        "Por la cantidad de detalles que esto requiere, te recomiendo que consultes directamente por WhatsApp. ¡Hagamos magia juntos! ✨"
    };


    async getResponse(message: string): Promise<{ reply: string; options?: { id: string; label: string }[] }> {
        
        if (!message || typeof message !== 'string') {
            return { reply: 'Por favor, escribí un mensaje válido para que pueda ayudarte. 🦊✨ (Pssst!! Decime "hola"!!)' };
          }
        
        const lowerMessage = message.toLowerCase();

        if (lowerMessage === 'hola' || lowerMessage === 'inicio') {
            return {
                reply: "¡Hola, soy Valki! 🦊✨ Soy la guardiana oficial de Valkirias y estoy aquí para ayudarte con cualquier duda que tengas. ¿Qué necesitas saber hoy? 👇",
                options: this.options.inicio
            };
        }

        if (lowerMessage === 'adios' || lowerMessage === 'gracias' || lowerMessage === 'fin') {
            return {
                reply: "¡Espero haberte ayudado, compi! 🦊✨ Si querés saber algo más, estoy aquí. O si no, siempre podés pasar por el WhatsApp. ¡Nos leemos luego!"
            };
        }

        if (this.options[lowerMessage]) {
            return { reply: this.options[lowerMessage] };
          }

          return {
            reply: 'Escribí "hola" o "inicio" para ver las opciones disponibles o contáctanos por WhatsApp. 🦊✨',
          };

    }
}
