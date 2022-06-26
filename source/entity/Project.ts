import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from 'type-graphql-dataloader';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Todo } from './Todo';
import { User } from "./User";

@ObjectType()
@Entity()
export class Project {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Column()
  userId: number

  @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
  user: User

  @Field(() => [Todo])
  @OneToMany(() => Todo, todo => todo.project)
  @TypeormLoader()
  todos: Todo[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date
}
