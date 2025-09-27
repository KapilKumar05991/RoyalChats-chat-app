import cloudinary from "../config/cloudinary.js"
import { User } from "../models/user.js"
import { signToken } from "../utils/auth.js"
import ENV from "../lib/env.js"
import { StatusCodes } from "http-status-codes"
import type { Request, Response } from "express"
import { Conversation } from "../models/conversation.js"
import { updateSchema } from "../utils/types.js"
import { Message } from "../models/message.js"

const update = async (req: Request, res: Response) => {
  try {
    const { name, oldPassword, newPassword } = req.body
    if (!name && !oldPassword && !newPassword) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "No Inputs Provided"
      })
    }
    const body = {
      name: name || undefined,
      oldPassword: oldPassword || undefined,
      newPassword: newPassword || undefined
    }

    const validate = updateSchema.safeParse(body)
    if (!validate.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid Inputs',
        error: validate.error
      })
    }
    if (body.oldPassword && body.newPassword && body.oldPassword === body.newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Old and New Password should not be same'
      })
    }

    let avatar;
    if (req.file) {
      avatar = req.file
    }

    // @ts-ignore
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'User Not found'
      })
    }

    if (body.name) {
      user.name = body.name
    }

    if (avatar) {
      if (user.avatar.path) {
        await cloudinary.uploader.destroy(user.avatar.public_id)
      }

      user.avatar.path = avatar.path
      user.avatar.public_id = avatar.filename
    }

    if (oldPassword) {
      const result = await user.comparePassword(oldPassword)
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Old password is incorrect'
        })
      }
      if (newPassword) {
        user.password = newPassword
      }
    } else if (newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Old password is required'
      })
    }
    await user.save()

    const updatedUser = await User.findById(userId).select('-password')
    const token = signToken({ id: user._id, email: user.email });
    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "development" ? false : true,
      sameSite: ENV.NODE_ENV === "development" ? 'lax' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Profile not updated",
      error: error
    })
  }
}

const getContacts = async (req: Request, res: Response) => {
  try {

    //@ts-ignore
    const userId = req.user._id.toString()

    const conversations = await Conversation.find({
      "members.user_id": userId
    })

    const contacts_set = new Set()
    conversations.forEach((conversation) => {
      conversation.members.forEach((member) => {
        if (member.user_id != userId) {
          contacts_set.add(member.user_id)
        }
      })
    })
    const contacts_array = Array.from(contacts_set)
    const contacts = await User.find({
      _id: { '$in': contacts_array }
    }).select('-password').lean()

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Contacts fetch successfully',
      contacts
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch your contacts',
      error
    })
  }
}

const getGroups = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user._id

    const conversations = await Conversation.find({
      is_group: true,
      "members.user_id": userId
    }).populate([{ path: 'members.user_id', select: '-password' }])

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Groups fetch successfully',
      groups: conversations
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch your groups',
      error
    })
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {

    //@ts-ignore
    const userId = req.user._id
    const { filter } = req.query

    if (!filter) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'filter is required'
      })
    }
    const regex = new RegExp(`^${filter}`, 'i');
    const users = await User.find({
      _id: { '$ne': userId },
      name: regex
    }).select('-password')

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Users found',
      users: users
    })

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Users not found',
      error
    })
  }
}

const getMissedMessages = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user._id.toString()
  //@ts-ignore
  const lastSeen = req.user.last_seen

  const conversations = await Conversation.find({
    is_group: false,
    "members.user_id": userId
  })
  const missed: {[key: string]: {count: number, last_message: any}} = {}
  for (const conversation of conversations) {
    const messages = await Message.find({
      conversation_id: conversation._id,
      createdAt: { '$gt': lastSeen }
    }).sort({ createdAt: 1 }).lean()

    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
      const senderId = lastMessage.sender_id.toString()
      missed[senderId] = { count: messages.length, last_message: lastMessage }
    }
  }

  const groups = await Conversation.find({
    is_group: true,
    "members.user_id": userId
  })

  for (const conversation of groups) {
    const messages = await Message.find({
      conversation_id: conversation._id,
      createdAt: { '$gt': lastSeen }
    }).sort({ createdAt: 1 }).lean()
    const lastMessage = messages[messages.length - 1]

    if (lastMessage) {
      const convId = lastMessage.conversation_id.toString()
      missed[convId] = { count: messages.length, last_message: lastMessage }
    }
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Your missing messages',
    missed_messages: missed
  })
}

const updateLastSeen = async (id: string) => {
  await User.findByIdAndUpdate(id, {
    last_seen: new Date()
  })
}

export {
  update,
  getContacts,
  getUsers,
  getGroups,
  getMissedMessages,
  updateLastSeen
}