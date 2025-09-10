import { ProductComment } from "../entities/comment.entity";

export class CommentResponseDto {
  id: string;
  product_id: string;
  user_id?: string | null;
  session_id?: string | null;
  content: string;
  parent_comment_id?: string | null;
  created_at: Date;
  updated_at: Date;
  replies?: CommentResponseDto[];

  constructor(comment: ProductComment) {
    this.id = comment.id;
    this.product_id = comment.product_id;
    this.user_id = comment.user_id ?? null;
    this.session_id = comment.session_id ?? null;
    this.content = comment.content;
    this.parent_comment_id = comment.parentComment?.id ?? null;
    this.created_at = comment.created_at;
    this.updated_at = comment.updated_at;

    // recursively map replies
    if (comment.replies?.length) {
      this.replies = comment.replies.map(r => new CommentResponseDto(r));
    }
  }
}
