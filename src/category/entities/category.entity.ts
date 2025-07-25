import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, RelationId } from 'typeorm';

@Entity({name:'category'})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({type:'varchar', length:20, nullable:false, unique:true})
    name:string ;


    @Column({type:'varchar', length:20, nullable:true , default:null})
    description?:string | null = null;


    @Column({type:'varchar', nullable:true , default:null})
    image?:string | null = null;


    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
        name: 'created_at',
      })
      created_at: Date;
    
      @UpdateDateColumn({
        type: 'timestamptz',
        nullable: false,
        name: 'updated_at',
      })
      updated_at: Date;
    
      @DeleteDateColumn({
        type: 'timestamptz',
        nullable: true,
        name: 'deleted_at',
      })
      deleted_at?: Date | null;
}
