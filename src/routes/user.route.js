import { Router } from "express";
import { addToWishlistCtrl, createUserCtrl, deleteAddresssesCtrl, getAllAddresssesCtrl, getManyUsersCtrl, getOneAddressCtrl, getUserAddresssesCtrl, getUserByIdCtrl, getUserProfileByIdCtrl, getWishlistCtrl, postAddresssesCtrl, registerUserCtrl, removeFromWishlistCtrl, updateAddresssesCtrl, updateUserCtrl, updateUserStatusCtrl } from "../controllers/user.controller.js";
import { validateMW } from "../middleware/validate.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userValidator } from "../validators/user.validator.js";
import { addressValidator } from "../validators/address.validator.js";
export const userRouter = Router();


userRouter.post('/register', validateMW, registerUserCtrl)

userRouter.use(authMiddleware)

userRouter.post("/wishlists/add", addToWishlistCtrl);
userRouter.post("/wishlists/remove", removeFromWishlistCtrl);

userRouter.get("/wishlists", getWishlistCtrl);

userRouter.post('/addresses', addressValidator.create, validateMW, postAddresssesCtrl)
userRouter.put('/addresses/:addressId', addressValidator.update, validateMW, updateAddresssesCtrl)
userRouter.delete('/addresses/:addressId', deleteAddresssesCtrl)

userRouter.get('/addresses/own', roleChecker(['user']), getUserAddresssesCtrl)
userRouter.get('/addresses/all', roleChecker(['admin']), getAllAddresssesCtrl)
userRouter.get('/addresses/:addressId', getOneAddressCtrl)

userRouter.get('/profile', roleChecker(['user']), getUserProfileByIdCtrl)
userRouter.put('', userValidator.update, validateMW, updateUserCtrl)

// admin
userRouter.use(roleChecker(['admin']))

userRouter.post('', userValidator.create, validateMW, createUserCtrl)
userRouter.patch('/:id', updateUserStatusCtrl)
userRouter.get('', getManyUsersCtrl)
userRouter.get('/:id', getUserByIdCtrl)
