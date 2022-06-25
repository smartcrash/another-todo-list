import { kebabCase } from "lodash";
import { Field, ObjectType } from "type-graphql";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

const uniqueId = () => (Math.random() + 1).toString(36).substring(7)

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

  @BeforeInsert()
  @BeforeUpdate()
  async createSlug() {
    if (this.title) {
      this.slug = kebabCase(this.title) + uniqueId()
    }
  }

  @Column()
  userId: number

  @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
  user: User

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
