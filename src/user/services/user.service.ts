import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { FileUpload } from 'src/files/entities/file.entity';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createUser(data: CreateUserDto, manager?: EntityManager): Promise<User> {

    const userRepo = manager ? manager.getRepository(User) : this.userRepository;
    try {
      const user = await userRepo.findOne({ where: { email: data.email } });
      if (user) {
        throw new Error('User with this email already exists');
      }
      const newUser = userRepo.create(data);
      return await userRepo.save(newUser);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile_picture', 'file', 'file.isActive = :isActive',
          { isActive: true })
        .select([
          'user.name',
          'user.email',
          "file.local_url",
          "file.isActive",
        ])
        .where('user.id = :id', { id })
        .getOne();
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, manager?: EntityManager) {
    const userRepo = manager ? manager.getRepository(User) : this.userRepository;
    try {
      const user = await userRepo.findOne({ where: { id }, relations: ['profile_picture'] });
      if (!user) {
        throw new Error('User not found');
      }

      if (updateUserDto.profile_picture && Array.isArray(user.profile_picture)) {
        // fisrt i have make the previous one inactive
        user.profile_picture.forEach(file => {
          file.isActive = false;
        }
        );

        const newFile =  new FileUpload()

        Object.assign(newFile,{
          ...updateUserDto.profile_picture,
          isActive: true,
          local_url: updateUserDto.profile_picture.path,
          public_url: null, // Assuming you want to set this later
          user: user,
        })

        user.profile_picture?.push(newFile as FileUpload);
      }
      const { profile_picture ,...rest} = updateUserDto
      // Update other fields
      Object.assign(user, rest);
      return await userRepo.save(user);

    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
