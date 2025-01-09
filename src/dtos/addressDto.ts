import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";



export class AddressDto {
      @ApiProperty({
        description: 'Calle',
        required: false,
      })
      @IsString()
      @IsOptional()
      street?: string;
    
      @ApiProperty({
        description: 'Número',
        required: false,
      })
      @IsOptional()
      number?: number;
    
      @ApiProperty({
        description: 'Codigo Postal',
        required: false,
      })
      @IsOptional()
      postalCode?: string;
    
    
      @ApiProperty({
        description: 'User city',
        required: false,
      })
      @IsString()
      @IsOptional()
      city?: string;
    
      @ApiProperty({
        description: 'User state',
        required: false,
      })
      @IsString()
      @IsOptional()
      state?: string;
}