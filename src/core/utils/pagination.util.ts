import { In, Like } from "typeorm";
import { } from 'typeorm';
import { AppDataSource } from "../database";
import { pagination } from "../interfaces/pagination.interface";

export function Pagination(entity: any, { limit, page, sort, sortBy, ...filter }: pagination) {
    const skip = (page - 1) * limit;
    const take = limit;
    let where = {};
    let order = {};

    const enumcolumns = AppDataSource.getMetadata(entity).ownColumns.filter(column => column.type === 'enum');
    const enumProperties = enumcolumns.map(column => column.propertyName)

    Object.keys(filter).forEach(key => {
        const value = filter[key]
        if (value === '') {
            return;
        }
        if (typeof value === 'string' && !enumProperties.includes(key)) {
            where[key] = Like(`%${value}%`)
            return;
        }
        if (enumProperties.includes(key)) {
            where[key] = In(value)
            return;
        }
        where[key] = value;
    });
    if (sort != undefined) {
        order[sort] = sortBy;
    }
    return {
        skip,
        take,
        where,
        order
    }
}