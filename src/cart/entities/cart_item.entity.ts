import { User } from "../../user/entities/user.entity";
import { BaseEntity } from "../../common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "../../product/entities/product.entity";


@Entity("cart_items")
export class CartItems extends BaseEntity {

    @ManyToOne(() => Cart, (cart) => cart.cart_items, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "cart_id", referencedColumnName: "id" })
    cart: Cart

    @RelationId((cartitems: CartItems) => cartitems.cart)
    cart_id: string

    @ManyToOne(() => Product, (p) => p.cart_items, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Product

    @RelationId((cartitems: CartItems) => cartitems.product)
    product_id: string


    @Column({ type: "int", default: 1 })
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2 })
    priceAtAddTime: number; // store price snapshot in case product price changes

}