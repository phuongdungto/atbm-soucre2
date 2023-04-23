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
import { Comment } from "../comments/comment.entity";
import { Image } from "../images/image.entity";
@Entity('posts')
export class Post {
    constructor(data: Partial<Post>) {
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'content' ,type:'text'})
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn()
    user: Relation<User>;

    @Column({ nullable: true })
    userId: number

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Relation<Comment>[];

    @OneToMany(() => Image, (image) => image.post)
    images: Relation<Image>[];
}