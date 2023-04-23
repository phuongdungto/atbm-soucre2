import { ReqUser } from '../../core/interfaces/user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: ReqUser;
        }
    }
}

// import { Request } from "express"
// export interface ReqUsers extends Request {
//     user?: any // or any other type
// }