import * as Joi from "joi";
import { Request, Response, NextFunction } from 'express';
import { validate } from "../core/utils/validate.util";
import * as commentService from "./comment.service";
// import { AddUserProjectDTO, AddUserTaskDTO, CreateUserDTO, LoginDTO } from "./user.dto";
import { Roles } from "../core/enum";
import { pagination } from "../core/interfaces/pagination.interface";
import { createCommentDTO } from "./comment.dto";

export async function createComment(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            content: Joi.string().required(),
            postId: Joi.number().required(),
            userId: Joi.number().required()
        })
        const comment = {
            ...req.body,
            userId: req.user.id
        }
        console.log(comment)
        const value = validate<createCommentDTO>(comment, schema);

        const result = await commentService.createComment(value);
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            postId: Joi.number().required()
        })
        const value = validate<pagination>(req.query, schema);

        const result = await commentService.getComments(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

// export async function getComment(req: Request, res: Response, next: NextFunction) {
//     try {
//         const result = await postService.getPost(+req.params.id);
//         return res.status(200).send(result);
//     } catch (error) {
//         return next(error);
//     }
// }
