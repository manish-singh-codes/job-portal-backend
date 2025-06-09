import express from 'express'
import { forgotPassword, getUser, googleLogin, googleRegister, login, logout, register, resend, resetPassword, updateProfile, verifyOtp } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../utils/multer.js';



const router = express.Router();

router.route('/register').post( upload.single('file'), register);
router.route('/google/register').post(googleRegister);
router.route('/google/login').post(googleLogin);
router.route('/verify').post(verifyOtp)
router.route('/resend').post(resend)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').post( isAuthenticated, updateProfile)
router.route('/getUser').get( isAuthenticated, getUser)


export default router