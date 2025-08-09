import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
  ){}

  async createUser(data: CreateUserDto , manager?: EntityManager ): Promise<User> {

    const userRepo = manager ?  manager.getRepository(User) : this.userRepository;
    try {
      const user = await userRepo.findOne({ where: { email: data.email } });
      if (user) {
        throw new Error('User with this email already exists');
      }
      const newUser = userRepo.create(data);
      return await userRepo.save(newUser);
    }catch(error){
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.files', 'file')
      .select([
        'user.name',
        'user.email',
        
        
        "file.local_url",
      ])
        .where('user.id = :id', { id })
        .getOne();
    }catch (error) {
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
