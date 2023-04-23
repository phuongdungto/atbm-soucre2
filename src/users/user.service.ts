import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from "dotenv";
import { In } from "typeorm";
import { pagination } from "../core/interfaces/pagination.interface";
import { Pagination } from "../core/utils/pagination.util";
import { AppDataSource } from '../core/database';
import { User } from './user.entity';
import { CreateUserDTO, LoginDTO } from './user.dto';
import { BadRequest, Unauthorized, NotFound } from 'http-errors';
import fs from 'fs/promises';
import * as path from 'path';
dotenv.config();

const userRepo = AppDataSource.getRepository(User);

const saltRounds = 10;

export async function signup(CreateUserDTO: CreateUserDTO) {
    const checkuser = await userRepo.findOneBy({
        email: CreateUserDTO.email
    })
    if (checkuser) {
        throw new BadRequest('email already existed');
    }
    console.log(CreateUserDTO)
    const newuser = new User(CreateUserDTO);
    const salt = await bcrypt.genSalt(saltRounds)
    newuser.password = await bcrypt.hash(newuser.password, salt);
    await userRepo.save(newuser);
    delete newuser.password;
    return newuser;
}

export async function signin(CreateUserDTO: LoginDTO) {
    const user = await userRepo.findOneBy({
        email: CreateUserDTO.email,
    })
    if (!user) {
        throw new BadRequest('email or password is incorrect');
    }
    const iPwd = bcrypt.compare(CreateUserDTO.password, user.password);
    if (!iPwd) {
        throw new BadRequest('email or password is incorrect');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });
    delete user.password;

    return { information: user, accessToken: accessToken };
}

export async function updateUser(id: number, image: string) {
    const newuser = await userRepo.findOneBy({
        id: id
    })
    await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({ image: image })
        .where("id = :id", { id: id })
        .execute()
    if (!newuser) {
        throw new NotFound('User not found')
    }
    fs.unlink(path.join(__dirname, `../../public/avatar/image`, newuser.image)).catch(error => console.log(error));
    return newuser;
}

export async function deleteUser(id: number) {
    const newuser = await userRepo.findOneBy({
        id: id
    })
    if (!newuser) {
        throw new NotFound('User not found')
    }
    await userRepo.softDelete(id);
}

export async function getUser(id) {
    const user = await userRepo.findOneBy({
        id: id
    })
    if (!user) {
        throw new NotFound('User not found')
    }
    return user;
}