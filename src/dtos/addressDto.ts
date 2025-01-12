import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";



export class AddressDto {
  @ApiProperty({ example: '123 Main Street' })
  street: string;

  @ApiProperty({ example: '456' })
  number: number;

  @ApiProperty({ example: 'Buenos Aires' })
  city: string;

  @ApiProperty({ example: 'Buenos Aires' })
  state: string;

  @ApiProperty({ example: '1000' })
  postalCode: string;
}