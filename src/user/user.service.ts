import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';
import { UpdateUserDto } from 'src/dtos/updateUserDto';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { Address } from 'src/entities/address.entity';
import { AddressDto } from 'src/dtos/addressDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userDBRepository: Repository<User>,
    private readonly userRepository: UserRepository,
    private readonly geoCodingService: GeocodingService,
  ) {
    console.log('GeoServiceUser:', GeocodingService);
  }

  async getAllUser() {
    const users = await this.userRepository.getAllUser();
    const userWithoutPass = users.map(
      ({ password, ...userWithoutPass }) => userWithoutPass,
    );
    return userWithoutPass;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  }

  async createUser(userData: UserDto) {
    try {
      const newUser = await this.userRepository.createUser(userData);
      const { password, ...userWithoutPass } = newUser;

      return userWithoutPass;
    } catch (error) {
      throw new BadRequestException('Error al crear usuario');
    }
  }
  
  async updateAddress(userId: string, addresses: AddressDto[]): Promise<Address[]> {
    const user = await this.userDBRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],  
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    const updatedAddresses = [];
    
    for (const addressDto of addresses) {
      let address = user.addresses.find(
        (existingAddress) =>
          existingAddress.street === addressDto.street &&
        existingAddress.number === addressDto.number &&
        existingAddress.postalCode === addressDto.postalCode
      );
      
      if (!address) {
        
        const coordinates = await this.geoCodingService.getCoordinates(
          addressDto.street,
          addressDto.number,
          addressDto.city,
          addressDto.state,
          addressDto.postalCode,
        );
        
        if (!coordinates) {
          throw new NotFoundException('No se pudieron obtener las coordenadas');
        }
        
        address = new Address();
        address.street = addressDto.street;
        address.number = addressDto.number;
        address.postalCode = addressDto.postalCode;
        address.city = addressDto.city;
        address.state = addressDto.state;
        address.latitude = coordinates.latitude;
        address.longitude = coordinates.longitude;
        address.user = user;  
        
        await this.addressRepository.save(address);
      } else {
        
        address.street = addressDto.street;
        address.number = addressDto.number;
        address.postalCode = addressDto.postalCode;
        address.city = addressDto.city;
        address.state = addressDto.state;
        
        const coordinates = await this.geoCodingService.getCoordinates(
          addressDto.street,
          addressDto.number,
          addressDto.city,
          addressDto.state,
          addressDto.postalCode,
        );
        
        if (coordinates) {
          address.latitude = coordinates.latitude;
          address.longitude = coordinates.longitude;
        }
        
        await this.addressRepository.save(address);
      }
      
      updatedAddresses.push(address);
    }
    
    return updatedAddresses;
  }

  async updateUser(
    userId: string,
    updateUser: UpdateUserDto,
  ): Promise<Partial<User>> {
    const findUser = await this.userRepository.getUserById(userId);
    if (!findUser) throw new NotFoundException('Usuario no encontrado');
  
    const user = Object.assign(findUser, updateUser);
  
    
    const { addresses, password, ...userWithoutPass } = user;
  
   
    await this.userRepository.userUpdate(userId, userWithoutPass);
  
    
    if (addresses) {
      await this.updateAddress(userId, addresses);  
    }
    console.log('Updated address', addresses)
  
    return userWithoutPass;
  }
  

  async updateProfileImg(id: string, photo: Express.Multer.File) {
    const userUpdated = await this.userRepository.updateProfileImg(id, photo);
    return userUpdated;
  }

  async deactiveUser(id: string) {
    return await this.userRepository.deactivateUser(id);
  }

  async activeUser(id: string) {
    return await this.userRepository.activeUser(id);
  }

  async removeUser(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.removeUser(id);
    return 'Usuario eliminado con exito';
  }

  async changeIsAdmin(id: string) {
    return await this.userRepository.changeIsAdmin(id);
  }

  async removeAddress(userId: string, addressId: string) {
    const user = await this.userDBRepository.findOne({ 
      where: {id: userId},
      relations: ['addresses']
    })

  if(!user) {
    throw new NotFoundException('Usuario no encontrado')
  }
  const address = user.addresses.find((addr) => addr.id === addressId);
  if(!address) {
    throw new NotFoundException('Dirreción no encontrada')
  }

  await this.addressRepository.delete(address);

  return 'Dirección eliminada correctamente' 
  }

}
