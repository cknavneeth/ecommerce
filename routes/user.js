const express=require("express")
const router =express.Router()
const userController=require("../controller/user/userController")


router.get("/",(req,res)=>{
    
    res.render("user/signup",{error:null})

})
router.post("/signup",userController.signupRedirect)


router.post("/otpvalidate",userController.otppage)

router.post("/resend-otp",userController.resendOtp)

router.post("/login",userController.loginRedirect)

router.get("/index",userController.indexPage)

module.exports=router