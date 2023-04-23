import * as express from 'express';
import { Roles } from '../core/enum';
import {
    createComment, getComments
} from './comment.controller';
import { authorization } from '../core/middleware/auth.middleware';

const router = express.Router();

router.post('/', authorization(Roles.USER, Roles.ADMIN), createComment);
router.get('/', getComments);
// router.put('/')

export default router;