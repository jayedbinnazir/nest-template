import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';

// import { Expose } from 'class-transformer';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0, // Defaults to 0 if not provided
    transformer: {
      to: (value: number): string => {
        return value.toString();
      },
      from: (value: string): number => {
        return parseFloat(value);
      },
    },
  })
  price: number = 0;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock_quantity: number = 0;

  @Column({ type: 'int', nullable: true })
  sold_quantity?: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  view_count: number = 0;

  @Column({
    type: 'text', // or 'json'
    nullable: false, // Disallow NULL in DB
    default: '[]',  // ✅ DB default as JSON string
    transformer: {
      to: (value: string[] | null | undefined) => 
        JSON.stringify(value ?? []), // Handle null/undefined → '[]'
      from: (value: string) => JSON.parse(value), // DB → TS array
    },
  })
  available_colors: string[] = []; // Initialize as null (optional)

  @Column({
    type: 'text', // or 'json'
    nullable: false, // Disallow NULL in DB
    default: '[]',  // ✅ DB default as JSON string
    transformer: {
      to: (value: string[] | null | undefined) => 
        JSON.stringify(value ?? []), // Handle null/undefined → '[]'
      from: (value: string) => JSON.parse(value), // DB → TS array
    },
  })
  image_gallery: string[] = []; // ✅ TS default



  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deleted_at: Date | null;

  // getters
  @Expose()
  display_price(): string|number {
    if (this.price > 0) {
      return this.price;
    }
    return 'Coming Soon';
  }

  // Yes, this code is okay. It returns the stock quantity as a string if it exists, otherwise it returns 'Coming Soon'.
  @Expose()
  display_stock_quantity(): number | string {
    if (this.stock_quantity > 0) {
      return this.stock_quantity 
    }
    return 'Out of Stock';
  }
}
