// src/entities/product.entity.ts
import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { BaseEntity } from '../../common/base.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    RelationId,
    OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FileUpload } from '../../files/entities/file.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {

    @Column()
    name: string; // Example: "Elf Bar 5000 Puff", "Mango Ice E-liquid 60ml"

    @Column({ type: "varchar", nullable: true })
    importedFrom?: string | null; // Example: "China", "USA"

    @Column({ type: 'varchar', length: 300, nullable: true })
    description?: string | null;

    @Column('decimal', { precision: 10, scale: 2, nullable: true ,default: 0})
    price: number ;

    @Column({type:"int", default: 0})
    quantity: number; // Example: 100, 50, 200

    @Column({ default: true })
    isAvailable: boolean;

    @Column({ type: 'varchar', length: 20 , nullable: true })
    brand?: string|null; // Example: "Vaporesso", "Elf Bar", "SMOK"

    @Column({  type:"varchar" , nullable: true })
    nicotineStrength?: string|null; // Example: "3mg", "20mg", "50mg"

    @Column({ nullable: true , type: 'varchar' , length: 50 })
    flavor?: string|null; // Example: "Mango Ice", "Cool Mint"



    //relationships
    @OneToMany(() => ProductCategory , (x)=>x.product ,{
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    })
    product_category: ProductCategory[];


    //relation withn User
    @ManyToOne(()=> User ,  (user)=>user.products)
    @JoinColumn({name : 'user_id' , referencedColumnName: 'id'})
    user: User;

    @RelationId ((product: Product) => product.user)
    user_id: string;


    @OneToMany(()=> FileUpload , (file)=> file.product ,{
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    nullable: true,
  })
    product_images?: FileUpload[]; // Assuming multiple images can be associated with a product

}
