import { Injectable } from '@nestjs/common';
import { CreateUserFileDto } from './dto/create-user_file.dto';
import { UpdateUserFileDto } from './dto/update-user_file.dto';

@Injectable()
export class UserFileService {
  create(createUserFileDto: CreateUserFileDto) {
    return 'This action adds a new userFile';
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
