import{Router}  from 'express'
import { registerUser , getAllFarmersDetail } from '../Controlers/User.Controler.js'
import {upload } from '../Middleware/Multer.js'
import { LogoutUser,adminPanel,forgetPassword , DeleteAccountofFarmer } from '../Controlers/User.Controler.js'
import { loginuser, googleLogin } from '../Controlers/User.Controler.js'
import { verifyjwt } from '../Middleware/auth.middleware.js'
import{refreshAccessToken,
   changePassword,
   
   updatedAccountDetail,
   updatedAvatarImage,} 
   from '../Controlers/User.Controler.js'
   

   
const router= Router()
router.route("/register").post(
    upload.fields([
        {
        name:"avatar",
        maxCount:1
    },
        
    ]),
    registerUser
)
router.route("/login").post(loginuser)
router.route("/google-login").post(googleLogin)
router.route("/adminlogin").post(adminPanel)
router.route("/logout").post(verifyjwt,LogoutUser)
router.route("/refresh_token").post(refreshAccessToken)
router.route("/changed-password").post(verifyjwt,changePassword)
router.route("/all-Farmers").get(getAllFarmersDetail)
router.route("/forget-password").post(forgetPassword)

router.route("/updated-account").patch(verifyjwt,updatedAccountDetail)
router.route("/avatar").patch(verifyjwt,upload.single("avatar"),updatedAvatarImage)
router.route("/delete-farmer-account").delete(verifyjwt,DeleteAccountofFarmer)

export default router