import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { User, type IUser } from "../models/user.js";
import { signToken } from "../utils/auth.js";
import { loginSchema, registerSchema } from "../utils/types.js";
import ENV from "../lib/env.js";

const register = async (req: Request, res: Response) => {
  const validate = registerSchema.safeParse(req.body)
  if (!validate.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid inputs',
      error: validate.error
    })
  }

  try {

    const { name, password } = req.body;
    const email = req.body.email.toLowerCase()
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Email already exist'
      })
    };

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = signToken({ id: user._id, email: user.email });
    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "development" ? false : true,
      sameSite: ENV.NODE_ENV === "development" ? 'lax' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Registered succesfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Registeration Failed',
      error
    });
  }
}

const login = async (req: Request, res: Response) => {
  const validate = loginSchema.safeParse(req.body)
  if (!validate.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Incorrect Email Or Password',
      error: validate.error
    })
  }

  try {
    const email = req.body.email.toLowerCase()
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      })
    };

    const result = await user.comparePassword(password)
    if (!result) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Invalid Password',
      })
    }

    const token = signToken({ id: user._id, email: user.email });
    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "development" ? false : true,
      sameSite: ENV.NODE_ENV === "development" ? 'lax' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Logged in successfully'
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      error: error
    })
  }
}

const logout = async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: ENV.NODE_ENV === "development" ? false : true,
    sameSite: ENV.NODE_ENV === "development" ? 'lax' : 'none',
    maxAge: 5 * 1000
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully!'
  })
}


const me = async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Authenticated successfully',
    user
  })
}

export {
  register,
  login,
  logout,
  me
}