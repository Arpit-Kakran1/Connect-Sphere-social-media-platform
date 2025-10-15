import express from 'express';
import { editProfile, followOrunfollow, getProfile, login, logout, register, suggestedUser } from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated,getProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single("profilePhoto"), editProfile);
router.route("/suggested").get(isAuthenticated, suggestedUser);
router.route("/followOrunfollow/:id").post(isAuthenticated, followOrunfollow);

export default router;