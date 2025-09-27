import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getContacts, getGroups, getMissedMessages, getUsers, update } from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const userRouter = Router()

userRouter.get('/', authMiddleware, getUsers)
userRouter.patch('/update', authMiddleware,upload.single('profilePic'), update)
userRouter.get('/contacts', authMiddleware, getContacts)
userRouter.get('/groups', authMiddleware, getGroups)
userRouter.get('/messages/missed',authMiddleware,getMissedMessages)

export default userRouter