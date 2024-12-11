import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  sizes?: string[];
}
