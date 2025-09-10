import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  product_id: string; // Product being commented on

  @IsOptional()
  @IsString()
  parent_comment_id?: string; // If replying to a comment

  @IsOptional()
  @IsString()
  user_id?: string; // For guest users


  @IsOptional()
  @IsString()
  session_id?: string; // For guest users
  
  @IsString()
  @Length(1, 1000)
  content: string; // The actual comment text
}
