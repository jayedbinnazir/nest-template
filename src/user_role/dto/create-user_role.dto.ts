import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsUUID()
  role_id: string;
}
