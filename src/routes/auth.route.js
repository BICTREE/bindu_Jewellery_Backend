
import { Router } from "express";
import { regenerateTokens, resetPassword, sendOTPHandler, userLogin, verifyOTPHandler } from "../controllers/auth.controller.js";
import { ratelimiter } from "../middleware/rateLimiter.middleware.js";

export const authRouter = Router()

authRouter.post('/login', userLogin)


// authRouter.post("/google", googleHandler)

authRouter.post('/regenerate-token', regenerateTokens)

authRouter.post('/send-otp', ratelimiter, sendOTPHandler)
authRouter.post('/verify-otp', verifyOTPHandler)

// forgot password
authRouter.post('/reset-password', resetPassword)
