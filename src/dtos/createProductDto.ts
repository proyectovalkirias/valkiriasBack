import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @Length(10, 100)
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  sizes: string[];

  @IsNotEmpty()
  @IsString()
  category: string;
}
