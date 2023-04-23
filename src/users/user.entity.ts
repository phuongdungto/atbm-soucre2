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
import { Roles } from "../core/enum";
import { Post } from "../posts/post.entity";
import { Comment } from "../comments/comment.entity";
@Entity('users')
export class User {
    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'fullname' })
    fullname: string;

    @Column({ name: 'email', nullable: false })
    email: string;

    @Column({ name: 'password', select: false })
    password?: string;

    @Column({
        name: 'role',
        type: 'enum',
        enum: Roles,
        default: Roles.USER,
        nullable: false
    })
    role: Roles;

    @Column({ name: 'image', default: 'default-avatar.jpg' })
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Relation<Comment>[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Relation<Post>[];
}