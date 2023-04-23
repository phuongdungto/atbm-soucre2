import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Relation,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { User } from "../users/user.entity";
import { Post } from "../posts/post.entity";
@Entity('comments')
export class Comment {
    constructor(data: Partial<Comment>) {
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'content' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn()
    user: Relation<User>;

    @Column({ nullable: true })
    userId: number

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn()
    post: Relation<Post>;

    @Column({ nullable: true })
    postId: number
}