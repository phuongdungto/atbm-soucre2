import * as fs from "fs/promises";
import * as path from 'path';
import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { Comment } from '../comments/comment.entity';
// import { CreateProductDTO, UpdateProductDTO } from './products.dto';
import { pagination } from '../core/interfaces/pagination.interface';
import { Pagination } from '../core/utils/pagination.util';
import { query } from "express";
import { IsNull, Not } from "typeorm";
import { createCommentDTO } from "./comment.dto";

const commentRepo = AppDataSource.getRepository(Comment);

export async function createComment(body: createCommentDTO) {
    const comment = await commentRepo.save(body);
    return comment;
}

export async function getComments(body: any) {
    const query = Pagination(Comment, body);
    const [list, count] = await commentRepo.findAndCount({
        ...query,
        relations: {
            user: true
        }
    })
    return { totalPage: Math.ceil(count / body.limit), comments: list }
}
