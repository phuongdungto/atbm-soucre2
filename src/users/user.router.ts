import * as express from 'express';
import { Roles } from '../core/enum';
import {
    signup,
    signin,
    updateUser,
    deleteUser,
    getUser
} from './user.controller';
import { authorization } from '../core/middleware/auth.middleware';
import { avatarImageUpload } from '../core/static/image.static';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/:id', avatarImageUpload.single('image'), updateUser);
router.delete('/:id', authorization(Roles.ADMIN), deleteUser);
router.get('/:id', getUser);

export default router;