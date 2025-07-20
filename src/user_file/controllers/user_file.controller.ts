import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserFileDto } from '../dto/create-user_file.dto';
import { UpdateUserFileDto } from '../dto/update-user_file.dto';
import { UserFileService } from '../services/user_file.service';

@Controller('user-file')
export class UserFileController {
  constructor(private readonly userFileService: UserFileService) {}

  @Post()
  create(@Body() createUserFileDto: CreateUserFileDto) {
    return this.userFileService.createUserFile(createUserFileDto);
  }

  @Get()
  findAll() {
    return this.userFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFileDto: UpdateUserFileDto) {
    return this.userFileService.update(+id, updateUserFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFileService.remove(+id);
  }
}
