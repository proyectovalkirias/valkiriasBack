import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const SwaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto Valkirias')
    .setDescription(
      `Esta API es la columna vertebral de un ecommerce desarrollado para un emprendimiento real dedicado a la personalización de prendas y artículos, como remeras, buzos, gorras, tazas, entre otros.  
    Su propósito es gestionar el flujo de operaciones esenciales, como la administración de productos, usuarios y pedidos, asegurando una experiencia eficiente tanto para los administradores del negocio como para los clientes finales.\n\n
    Proyecto Académico\n
    Este proyecto fue desarrollado como trabajo final de la carrera de Full Stack Developer en Soy Henry, donde el equipo aplicó los conocimientos adquiridos durante la cursada.  
    La API sigue estándares modernos de desarrollo y fue diseñada para ser escalable, segura y de fácil integración con aplicaciones frontend y herramientas externas.\n\n
    Funcionalidades Clave:\n\n 
    Gestión de Usuarios:\n\n
    - Registro de nuevos usuarios.\n
    - Inicio de sesión con autenticación basada en JWT y autenticación de terceros (Google).\n
    - Actualización de perfiles de usuario.\n
    - Roles de usuario: cliente y administrador.\n\n
    Gestión de Productos:\n
    - Creación, edición y eliminación de productos (para administradores).\n
    - Consulta de productos disponibles, con detalles como precio y opciones de personalización.\n\n
    Carrito de Compras:\n
    - Agregar y eliminar productos al carrito.\n
    - Modificar cantidades de productos en el carrito.\n
    - Visualización del resumen del carrito.\n\n
    Gestión de Pedidos:\n
    - Creación de pedidos a partir del carrito de compras.\n
    - Consulta del historial de pedidos de un usuario.\n\n
    Notificaciones:\n
    - Envío de correos electrónicos para confirmar registro de usuario y pedidos realizados.\n\n
    Objetivo del Proyecto:\n
    El objetivo principal de esta API es proporcionar una solución robusta para un emprendimiento real de prendas personalizadas, 
    permitiendo a los usuarios interactuar con un catálogo dinámico, gestionar pedidos de forma fluida y personalizar sus compras según sus necesidades. `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);
};
