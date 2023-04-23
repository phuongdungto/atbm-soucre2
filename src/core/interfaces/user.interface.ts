import { Roles } from '../enum';

export interface ReqUser {
    id: number
    email: string
    role: Roles
}