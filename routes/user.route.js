import express from 'express'
import { login, logout, register, updateProfile } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../utils/multer.js';



const router = express.Router();

router.route('/register').post( upload.single('file'), register);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').post( isAuthenticated, updateProfile)


export default router