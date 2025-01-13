import { OrderStatus } from '../utils/orderStatus.enum';

export const ORDER_CHECKPOINTS = {
  [OrderStatus.PENDING]: {
    location: {
      latitude: parseFloat(process.env.VALKI_LAT || '0'), 
      longitude: parseFloat(process.env.VALKI_LONG || '0'),
    },
    description: 'Estado de pedido Pendiente',
  },
  [OrderStatus.IN_PREPARATION]: {
    location: {
      latitude: parseFloat(process.env.VALKI_LAT || '0'), 
      longitude: parseFloat(process.env.VALKI_LONG || '0'),
    },
    description: 'Pedido en preparación',
  },
  [OrderStatus.ON_THE_WAY]: {
    location: {
      latitude: parseFloat(process.env.CORREO_LAT || '0'), 
      longitude: parseFloat(process.env.CORREO_LONG || '0'),
    },
    description: 'Pedido en camino',
  },
};
