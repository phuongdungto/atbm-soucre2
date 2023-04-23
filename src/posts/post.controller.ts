import * as Joi from "joi";
import { Request, Response, NextFunction } from 'express';
import { validate } from "../core/utils/validate.util";
import * as postService from "./post.service";
// import { AddUserProjectDTO, AddUserTaskDTO, CreateUserDTO, LoginDTO } from "./user.dto";
import { Roles } from "../core/enum";
import { pagination } from "../core/interfaces/pagination.interface";

export async function createPost(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            content: Joi.string().required(),
            images: Joi.array().max(10).allow(null, '')
        })
        console.log(req.user)
        const images = req.files && Array.isArray(req.files) ? req.files.map(file => file.filename) : null
        const value = validate({
            ...req.body,
            images: images
        }, schema);

        const result = await postService.createPost(value, req.user);
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function getPosts(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.user);
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            userId: Joi.number().allow('')
        })
        const value = validate<pagination>(req.query, schema);

        const result = await postService.getPosts(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await postService.getPost(+req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            content: Joi.string(),
            images: Joi.array().max(10),
        })
        const value = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema);
        console.log(value);
        const result = await postService.updatePost(+req.params.id, value, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await postService.deletePost(+req.params.id, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}
