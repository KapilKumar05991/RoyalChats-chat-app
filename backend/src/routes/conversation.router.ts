import { Router } from "express";
import { deleteMessage, deleteAllMessages, getConversation, getMessages, sendMessage, createGroup, deleteGroup } from "../controllers/conversation.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const convRouter = Router()

convRouter.post('/',authMiddleware,createGroup)
convRouter.delete('/:id',authMiddleware,deleteGroup)
convRouter.get('/:receId',authMiddleware,getConversation)
convRouter.post('/messages/send',authMiddleware,upload.single('file'),sendMessage)
convRouter.get('/messages/:convId',authMiddleware, getMessages)
convRouter.delete('/messages/all/:convId',authMiddleware, deleteAllMessages)
convRouter.delete('/messages/:msgId',authMiddleware, deleteMessage)



export default convRouter