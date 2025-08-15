import { ProductCategory } from "../../product-category/entities/product-category.entity";
import { BaseEntity } from "../../common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: 'categories' })
export class Category extends BaseEntity {

    @Column({ type: 'varchar', length: 50 })
    name: string; // Example: "E-liquids", "Vape Devices", "Accessories"

    @Column({type: 'varchar', length: 300, nullable: true })
    description?: string | null; // Example: "Wide range of e-liquids", "Latest vape devices", "Vape accessories and parts"

    @OneToMany(() => ProductCategory , (x) =>x.category )
    product_category : ProductCategory[]; // Example: "E-liquids" can have subcategories like "Fruity", "Minty", etc.  
}
