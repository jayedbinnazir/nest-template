import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFileDto } from './create-user_file.dto';

export class UpdateUserFileDto extends PartialType(CreateUserFileDto) {}
