import { Product } from '../../product/entities/product.entity';
import { BaseEntity } from '../../common/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Entity('producnt_files')
export class FileProduct extends BaseEntity {
  @Column()
  fieldname: string; // Original name of the file as uploaded by the user

  @Column()
  originalname: string; //given name of the file after upload

  @Column()
  encoding: string; // Path where the file is stored on the server

  @Column()
  mimetype: string; // MIME type of the file

  @Column({ type: 'bigint' })
  size: number; // Size of the file in bytes

  @Column({ default: true })
  isActive: boolean;

  @Column()
  local_url: string; // Local path for the file storage

  // URL path for serving the file
  @Column({ type: 'varchar', nullable: true })
  public_url: string | null;

  @ManyToOne(() => Product, (product) => product.product_images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @RelationId((file: FileProduct) => file.product)
  product_id: string; // This will hold the ID of the associated product image
}
