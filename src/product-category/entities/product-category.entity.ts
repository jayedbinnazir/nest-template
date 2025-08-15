import { Product } from "../../product/entities/product.entity";
import { BaseEntity } from "../../common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Category } from "../../category/entities/category.entity";

@Entity({ name: 'product_category' })
export class ProductCategory  extends BaseEntity {
    // Define the properties of the ProductCategory entity here

    @ManyToOne(() =>Product , (product)=>product.product_category)
    @JoinColumn({ name: 'product_id' , referencedColumnName: 'id' })
    product : Product;

    @RelationId((productCategory: ProductCategory) => productCategory.product)
    product_id: string;


    @ManyToOne(() => Category   , (category) => category.product_category)
    @JoinColumn({ name: 'category_id' , referencedColumnName: 'id' })
    category: Category;

    @RelationId((productCategory: ProductCategory) => productCategory.category)
    category_id: string;


}
