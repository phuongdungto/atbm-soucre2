import { Pagination } from "../core/utils/pagination.util";
import { AppDataSource } from '../core/database';
import { BadRequest, Unauthorized, NotFound, Forbidden } from 'http-errors';
import { Post } from './post.entity';
import { Image } from '../images/image.entity';
import { updatePostDTO } from "./post.dto";
import { Comment } from "../comments/comment.entity";
import fs from 'fs/promises';
import * as path from 'path';

const postRepo = AppDataSource.getRepository(Post);
const imageRepo = AppDataSource.getRepository(Image)

export async function createPost(createPost: any, user: any) {
    const post = {
        content: createPost.content,
        userId: user.id
    }
    const newPost = new Post(post);

    const result = await postRepo.save(newPost);
    if (createPost.images) {
        const gets = createPost.images.map(img => (
            {
                name: img,
                postId: newPost.id
            }
        ))
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Image)
            .values(gets)
            .execute()
    }
    return await postRepo.findOne({
        where: { id: result.id },
        relations: {
            user: true,
            images: true
        }
    });
}

export async function getPosts(req) {
    const query = Pagination(Post, req);
    const [list, count] = await postRepo.findAndCount({
        ...query,
        relations: {
            images: true,
            user: true
        }
    })
    return { totalPage: Math.ceil(count / req.limit), posts: list }
}

export async function getPost(id: number) {
    const post = await postRepo.findOne({
        where: { id: id },
        relations: {
            images: true,
            comments: {
                user: true
            },
            user: true
        }
    })
    if (!post) {
        throw new NotFound('Post not found')
    }
    return post;
}

export async function updatePost(id: number, updatePost: updatePostDTO, user: any) {
    const postold = await postRepo.findOneBy({
        id: id
    })
    const images = await imageRepo.find({
        where: { postId: id }
    })
    // if (user.id !== postold.userId) {
    //     throw new Forbidden('Insufficient access');
    // }
    await AppDataSource
        .createQueryBuilder()
        .update(Post)
        .set({ content: updatePost.content })
        .where("id = :id", { id: id })
        .execute()
    if (updatePost.images) {
        await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Image)
            .where("post_id = :id", { id: id })
            .execute()
        const gets = updatePost.images.map(img => (
            {
                name: img,
                postId: id
            }
        ))
        images.map(img => {
            fs.unlink(path.join(__dirname, `../../public/post/image`, img.name)).catch(error => console.log(error));
        })
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Image)
            .values(gets)
            .execute()
    }

    const post = postRepo.findOne({
        where: { id: id },
        relations: {
            images: true
        }
    })
    return post
}

export async function deletePost(id: number, user: any) {
    const postold = await postRepo.findOneBy({
        id: id
    })
    if (!postold) {
        throw new NotFound('Post not found');
    }
    if (user.id !== postold.userId) {
        throw new Forbidden('Insufficient access');
    }
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Image)
        .where("post_id = :id", { id: id })
        .execute()

    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where("post_id = :id", { id: id })
        .execute()

    await postRepo.delete(id);

}