import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'addresses'}) 
    export class Address {

        @PrimaryGeneratedColumn('uuid')

        id: string;

        @Column({ nullable: true })
         @ApiProperty({
            description: 'Calle',
            example: 'Juan Bautista Alberdi',
            nullable: true,
          })
          street: string;
        
          @Column({ nullable: true })
          @ApiProperty({ 
            nullable: true,
            description: "Numero de la Calle"
          })
          number: number;
        
          @Column({ nullable: true})
          @ApiProperty({
            nullable: true,
            description: "Codigo postal"
          })
          postalCode: string;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'User City',
            example: 'Springfield',
          })
          city: string;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'User State',
            example: 'Buenos Aires',
          })
          state: string;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'Coordenada Longitud'
          })
          longitude: number;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'Coordenada Latitud'
          })
          latitude: number;

    }
    

