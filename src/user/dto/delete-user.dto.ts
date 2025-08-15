import { IsUUID, IsArray, IsOptional } from 'class-validator';

export class DeleteUserDto {
  @IsUUID()
  id: string;
}

export class DeleteManyUsersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
} 