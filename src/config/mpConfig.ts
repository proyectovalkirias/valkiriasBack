import { MercadoPagoConfig } from 'mercadopago';

const accessToken = process.env.ACCESS_TOKEN;
console.log(accessToken);
if (!accessToken) {
  throw new Error(
    'Mercado Pago access token is not defined. Check your .env file.',
  );
}

export const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken,
});
