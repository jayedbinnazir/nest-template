import { Category } from "src/category/entities/category.entity";
import { Product } from "src/product/entities/product.entity";
import {  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"category_product"})
export class CategoryProduct {
    @PrimaryGeneratedColumn()
    id:string;

    @Column({type:"uuid" ,  nullable:true})
    product_id:string;

    @ManyToOne(()=>Product  , (product)=>product.categoryProducts , {
        onDelete:"CASCADE",
        lazy:true
    } )
    @JoinColumn({ name:"product_id" })
    products:Promise<Product>


    @Column({type:"uuid" , nullable:true})
    category_id:string

    @ManyToOne(()=>Product  , (product)=>product.categoryProducts , {
        onDelete:"SET NULL",
        lazy:true,
        nullable:true
    } )
    @JoinColumn({ name:"product_id" })
    categories:Promise<Category> | null
}
