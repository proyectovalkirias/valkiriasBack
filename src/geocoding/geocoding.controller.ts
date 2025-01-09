import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
@ApiTags('Coordinates')
export class GeocodingController {
    constructor( private readonly geoCodingService: GeocodingService) {}



    @Get()
    @ApiOperation({ summary: 'Obtener coordenadas geográficas de una dirección.' })
    @ApiQuery({ name: 'street', description: 'Calle', required: true, type: String })
    @ApiQuery({ name: 'number', description: 'Número de calle', required: true, type: Number })
    @ApiQuery({ name: 'city', description: 'Ciudad', required: true, type: String })
    @ApiQuery({ name: 'state', description: 'Provincia', required: true, type: String })
    @ApiQuery({ name: 'postalCode', description: 'Código postal', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Coordenadas obtenidas exitosamente.', schema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', example: -34.6037 },
        longitude: { type: 'number', example: -58.3816 },
      },
    }})
    @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos.' })
    @ApiResponse({ status: 404, description: 'No se encontraron coordenadas para la dirección dada.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor al obtener coordenadas.' })
    async getCoordinates(
      @Query('street') street: string,
      @Query('number') number: number,
      @Query('city') city: string,
      @Query('state') state: string,
      @Query('postalCode') postalCode: string,
    ): Promise<{ latitude: number; longitude: number }> {
      if (!street || !number || !city || !state || !postalCode) {
        throw new BadRequestException('Todos los parámetros son obligatorios.');
      }
  
      return this.geoCodingService.getCoordinates(street, number, city, state, postalCode);
    }
}
