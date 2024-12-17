import { MercadoPagoConfig } from 'mercadopago';

const accessToken = process.env.ACCESS_TOKEN

export const mercadoPagoConfig = new MercadoPagoConfig({ 
    accessToken });