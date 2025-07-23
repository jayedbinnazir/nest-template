import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserFileDto } from '../dto/create-user_file.dto';
import { UpdateUserFileDto } from '../dto/update-user_file.dto';
import { UserFile } from '../entities/user_file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserFileService {

  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,
  ){}

  createUserFile(createUserFileDto: CreateUserFileDto) {
    try {
      const userFile = this.userFileRepository.create(createUserFileDto);
      return this.userFileRepository.save(userFile);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return `This action returns all userFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFile`;
  }

  update(id: number, updateUserFileDto: UpdateUserFileDto) {
    return `This action updates a #${id} userFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFile`;
  }
}
