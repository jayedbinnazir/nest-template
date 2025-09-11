import { IsEnum, IsOptional, IsString } from "class-validator";
import { ReactionType } from "../entities/reaction.entity";

export class CreateReactionDto {
  @IsString()
  product_id: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  session_id?: string;

  @IsEnum(ReactionType)
  type: ReactionType;
}
