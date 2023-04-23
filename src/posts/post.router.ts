import * as express from 'express';
import { Roles } from '../core/enum';
import {
    createPost, getPosts, getPost, updatePost, deletePost
} from './post.controller';
import { authorization } from '../core/middleware/auth.middleware';
import { productImageUpload } from '../core/static/image.static';
import { csrfProtection } from '../core/middleware/csurf.middleware';

const router = express.Router();

router.post('/', productImageUpload.array('images'), authorization(Roles.USER, Roles.ADMIN), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', productImageUpload.array('images'), authorization(Roles.USER, Roles.ADMIN), updatePost);
router.delete('/:id', authorization(Roles.USER, Roles.ADMIN), deletePost)

export default router;