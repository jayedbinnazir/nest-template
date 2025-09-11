import { User } from "../../user/entities/user.entity";
import { BaseEntity } from "../../common/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, RelationId } from "typeorm";
import { CartItems } from "./cart_item.entity";


@Entity("cart")
export class Cart extends BaseEntity {

    @OneToOne(() => User, (user) => user.cart, {
        onDelete: "CASCADE",
        nullable: true,
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user?: User | null; // For registered users

    @RelationId((cart: Cart) => cart.user)
    user_id?: string | null;

    @Column({ type: "varchar", nullable: true, unique: true })
    session_id: string | null; // For guest users


    @OneToMany(() => CartItems, (cartitems) => cartitems.cart, {
        cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    })
    cart_items: CartItems[];
}
