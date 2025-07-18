import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsOptional()
  @ValidateIf((o) => o.description !== undefined && o.description !== null && o.description !== '')
  @IsString()
  @MaxLength(20)
  description?: string;

  @IsOptional()
  @ValidateIf((o) => o.image !== undefined && o.image !== null && o.image !== '')
  @IsString()
  image?: string;
}
