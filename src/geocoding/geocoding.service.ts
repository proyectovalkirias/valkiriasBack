import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
    constructor(private readonly httpService: HttpService) {
    }


    async getCoordinates(
        street: string,
        number: number,
        city: string,
        state: String,
        postalCode: string,
    ): Promise<{ latitude: number; longitude: number;}> {
        const address = `${street}, ${number}, ${city}, ${state}, ${postalCode}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

        console.log("Recibiendo coordenadas de la direccion" + address);
        console.log(url);

        try {
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: {'User-Agent': 'NestJS App'},
                }),
            );
            const data = response.data;

            console.log('data:' + data);

            if (!data || typeof data === 'undefined') {
                throw new NotFoundException(
                    'No existe data o no se pudo extraer correctamente',
                );
            }

            if (data && data.length > 0) {
                const {lat, lon} = data[0];
                if(
                    !lat || 
                    typeof lat === 'undefined' ||
                    !lon ||
                    typeof lon === 'undefined'
                ) {
                    throw new NotFoundException(
                        'No se pudieron obtener las coordenadas',
                    );
                }

                return {latitude: parseFloat(lat), longitude: parseFloat(lon)};
            } else {
                throw new InternalServerErrorException('No se encontraron coordenadas para la direccion dada')
            }
            } catch (err) {
                console.error("Error obteniendo las coordenadas:" + err);
                throw new InternalServerErrorException('Error obteniendo las coordenadas');
            }
        }
    }

