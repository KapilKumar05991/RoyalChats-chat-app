import type { Request, Response } from "express"
import { Conversation } from "../models/conversation.js"
import { StatusCodes } from "http-status-codes"
import { Message } from "../models/message.js"
import { sendMessageToGroup, sendMessageViaSocket } from "../index.js"
import cloudinary from "../config/cloudinary.js"
import { groupSchema } from "../utils/types.js"


const getMessages = async (req: Request, res: Response) => {
    try {
        const { convId } = req.params
        if (!convId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'conversation id required',
            })
        }

        const messages = await Message.find({
            conversation_id: convId
        }).sort({ createdAt: 1 }).lean()

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Your conversation messages',
            messages
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Failed to fetch conversation messages',
            error
        })
    }
}

const sendMessage = async (req: Request, res: Response) => {
    const { conversationId, receiverId, text, isGroup } = req.body

    if (!text && !req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'text or file required'
        })
    }
    try {
        //@ts-ignore
        const userId = req.user._id
        if (isGroup) {
            const conv = await Conversation.findById(conversationId)
            if (!conv) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'This group is deleted by admin'
                })
            }
        }
        if (!receiverId && !isGroup) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Receiver id required'
            })
        }

        let attachment = undefined
        if (req.file) {
            attachment = req.file
        }

        const message = await Message.create({
            conversation_id: conversationId,
            sender_id: userId,
            text: text,
            attachment: {
                path: attachment?.path,
                public_id: attachment?.filename
            }
        })

        if (isGroup === 'true') {
            sendMessageToGroup(conversationId, message)
        }
        else {
            sendMessageViaSocket(receiverId, message)
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Message send successfully',
            msg: message
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Failed to send message',
            error
        })
    }
}

const deleteMessage = async (req: Request, res: Response) => {
    const { msgId } = req.params
    if (!msgId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            sucess: false,
            message: 'Message id requierd for delete'
        })
    }
    try {
        //@ts-ignore
        const userId = req.user._id.toString()
        const message = await Message.findById(msgId)
        if (message) {
            if (userId != message.sender_id.toString()) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: 'You are not owner of chat'
                })
            }
            if (message.attachment.path && message.attachment.public_id) {
                await cloudinary.uploader.destroy(message.attachment.public_id)
            }
            await message.deleteOne()
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Chat deleted successfully'
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Chat deletion failed',
            error
        })
    }
}

const deleteAllMessages = async (req: Request, res: Response) => {
    const { convId } = req.params
    if (!convId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            sucess: false,
            message: 'Conversation id requierd for delete'
        })
    }
    try {
        //@ts-ignore
        const userId = req.user._id
        const messages = await Message.find({
            conversation_id: convId,
            sender_id: userId
        })
        messages.forEach(async (message) => {
            if (message.attachment.path && message.attachment.public_id) {
                await cloudinary.uploader.destroy(message.attachment.public_id)
            }
            await message.deleteOne()
        })

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'All chats deleted'
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'All chats deletion failed'
        })
    }
}

const getConversation = async (req: Request, res: Response) => {
    try {
        const receId = req.params.receId
        //@ts-ignore
        const userId = req.user._id
        let conversation = await Conversation.findOne({
            "members.user_id": {
                $all: [
                    userId,
                    receId
                ]
            }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                members: [{ user_id: userId, role: 'member' }, { user_id: receId, role: 'member' }]
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Conversation found',
            conversation
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Server"
        })
    }
}

const createGroup = async (req: Request, res: Response) => {
    const validate = groupSchema.safeParse(req.body)
    if (!validate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Group name Or members required"
        })
    }
    //@ts-ignore
    const userId = req.user._id
    const { name, members } = req.body
    try {
        const isExist = await Conversation.findOne({
            name,
            is_group: true,
            members: { "$elemMatch": { user_id: userId } }
        })

        if (isExist) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: 'Group already exists'
            })
        }

        const membersArr = []
        membersArr.push({ user_id: userId, role: 'admin' })
        members.forEach((id: string) => {
            membersArr.push({ user_id: id, role: 'member' })
        })
        const conversation = await Conversation.create({
            name,
            is_group: true,
            members: membersArr
        })

        const group = await Conversation.findById(conversation._id).populate([{ path: 'members.user_id', select: '-password' }])
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Group created',
            group
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}

const deleteGroup = async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'conversation id required'
        })
    }
    try {
        //@ts-ignore
        const userId = req.user._id
        const conversation = await Conversation.findOne({
            _id: id,
            is_group: true,
            members: { "$elemMatch": { user_id: userId, role: 'admin' } }
        })
        if (!conversation) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not group admin Or Group not found'
            })
        }
        const messages = await Message.find({
            conversation_id: conversation._id
        })

        messages.forEach(async (message) => {
            if (message.attachment.path && message.attachment.public_id) {
                await cloudinary.uploader.destroy(message.attachment.public_id)
            }
            await message.deleteOne()
        })

        await conversation.deleteOne()
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Group deleted successfully'
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Internal Server Error',
            error
        })
    }
}


export {
    sendMessage,
    getMessages,
    getConversation,
    deleteMessage,
    deleteAllMessages,
    createGroup,
    deleteGroup
}