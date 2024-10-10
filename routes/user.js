const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");
const verifyUser=require('../middleware/authMiddlware')

router.get("/", (req, res) => {
  // res.render("user/signup", { error: null });
  res.redirect("/index");
});
router.get("/login", (req, res) => {
  res.render("user/login", { error: null });
});
router.get('/signup',(req,res)=>{
  res.render("user/signup", { error: null });
})

router.post("/signup", userController.signupRedirect);

router.post("/otpvalidate", userController.otppage);

router.post("/resend-otp", userController.resendOtp);

router.post("/login", userController.loginRedirect);

router.get("/index", userController.indexPage);

router.get('/shop',userController.shopPage)

router.get('/productDetails/:id',verifyUser,userController.productDetails) 

module.exports = router;
