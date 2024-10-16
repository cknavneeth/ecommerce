const User = require("../../models/userModel.js");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Product = require("../../models/productModel.js");
const jwt = require("jsonwebtoken");

// exports.signupRedirect=async (req,res)=>{
//      const {username,email,password,password2}=req.body
//      console.log(username)
//      console.log(password)
//      try{
//         //   if(password!==password2){
//         //     return res.render("/signup",{error:"password is not matching"})
//         //   }
//           const user=new User({username,email,password})
//           await user.save()
//           res.redirect('/otpvalidate')
//      }catch(err){
//          console.log(err)
//      }
// }
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, otp) {
  try {
    console.log(email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "verify your otp",
      text: `your otp is ${otp}`,
      html: `<b>ypou otp ${otp}</b>`,
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.error("Error sending Email", error);
    return false;
  }
}

exports.signupRedirect = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, password2 } = req.body;
 
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      return res.render("user/signup", { error: "EMAIL ALREADY EXISTS" });
    }

    const otp = generateOtp();
    const emailSent = await sendVerificationEmail(email, otp);
    console.log(emailSent);

    if (!emailSent) {
      return res.json("emailerror");
    }
    req.session.userOtp = otp;
    req.session.userData = { username, email, password };
    console.log(req.session.userData);
    res.render("user/otpVerification.ejs");
    console.log("OTP send", req.session.userOtp);
  } catch (error) {
    console.error("signup error", error);
  }
};

//password hashing
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {}
};

// exports.otppage = async (req, res) => {
//     try {
//         const { otp } = req.body;
//         if (otp === req.session.otp) {
//             const user = req.session.userData;
//             const passwordHash = await securePassword(user.password);

//             const saveUserData = new User({
//                 username: user.username,
//                 email: user.email,
//                 password: passwordHash
//             });

//             await saveUserData.save();
//             req.session.user = saveUserData.id;
//             // res.redirect("/");
//             return res.status(200).json({
//                 success: true,
//                 redirectUrl: "/"
//             });
//         } else {
//            res.status(500).json({success:false,error:"Invalid OTP,please try again"})
//         }
//     } catch (error) {
//         console.error("Error",error)
//         res.status(500).json({success:false,error:"error occured"})
//     }
// };
exports.otppage = async (req, res) => {
  try {
    const { otp } = req.body;
    const sessionOtp = req.session.userOtp;

    if (!otp || !sessionOtp || otp !== sessionOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP, please try again" });
    }

    const user = req.session.userData;

    const passwordHash = await securePassword(user.password);
    console.log(passwordHash);

    const saveUserData = new User({
      username: user.username,
      email: user.email,
      password: passwordHash,
    });

    await saveUserData.save();

    req.session.user = saveUserData.id;

    req.session.userOtp = null;

    return res.status(200).json({
      success: true,
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      error: "Error occurred during OTP verification",
    });
  }
};

//controller for handling resend otp

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.session.userData;
    if (!email) {
      res
        .status(400)
        .json({ success: false, error: "Email is not found.Sorry" });
    }
    const otp = generateOtp();
    req.session.userOtp = otp;
    const emailSent = await sendVerificationEmail(email, otp);
    if (emailSent) {
      res.status(200).json({ success: true, error: "OTP resend successfull" });
      console.log("resend Otp:", otp);
    } else {
      res.status(500).json({ success: false, error: "email not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "error while sending otp" });
    console.error(error);
  }
};

//login page redirecting

// exports.loginRedirect = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     console.log(username,password,user)
//     if (user && await bcrypt.compare(password, user.password)) {

//       return res.redirect('user/index');
//     } else {
//       return res.render('/', { error: 'Invalid login credentials' });
//     }
//   } catch (error) {

//     return res.status(500).render('/', { error: 'Something went wrong. Please try again.' });
//   }
// };

// exports.loginRedirect = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     console.log(username, password, user);

//     if (user && await user.matchPassword(password)) {
//       // Await bcrypt.compare to properly compare the password
//     //   const isMatch =  matchPassword(password, user.password);
//      console.log("com done")

//     //   if (isMatch) {
//         // If the password matches, redirect to the index route
//         return res.render('user/index');
//       } else {
//         // If the password doesn't match, render the login page with an error
//         return res.render('user/signup', { error: 'Invalid login credentials' });
//       }

//   } catch (error) {
//     // Handle server errors and render the login page with a generic error message
//     return res.status(500).render('user/signup', { error: 'Something went wrong. Please try again.' });
//   }
// };

exports.loginRedirect = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    console.log("User:", user); // Log the user object
    const trimmedPassword = password.trim();

    if (user) {
      // Log the entered password and the hashed password
      console.log("Entered Password:", password);
      console.log("Hashed Password:", user.password);

      const isMatch = await user.matchPassword(trimmedPassword);
      console.log("Password Match Result:", isMatch);

      if (isMatch) {
        console.log("Password match successful!");
        //   req.session.userId = user._id; // Store user ID in the session
        //   req.session.username = user.username; // Optionally store the username
        //   console.log('Session created:', req.session);

        const token = jwt.sign({ id: user._id }, "dididi", {
          expiresIn: "12d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          secure: false,
          sameSite: "Lax",
        });

        return res.redirect("/index"); // Render index page if login is successful               <<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>
      } else {
        console.log("Invalid login credentials.");
        return res.render("user/login", { error: "Invalid login credentials" });
      }
    } else {
      console.log("User not found.");
      return res.render("user/login", { error: "Invalid login credentials" });
    }
  } catch (error) {
    console.error(error); // Log the error
    return res.status(500).render("user/signup", {
      error: "Something went wrong. Please try again.",
    });
  }
};

//getting indexpage
exports.indexPage = async (req, res) => {
  try {
    const products = await Product.find({ isBlocked: false });
    console.log(products);
    res.render("user/index.ejs", { products });
  } catch (error) {
    console.error(error);
  }
};
exports.shopPage = async (req, res) => {
  try {
    const products = await Product.find({ isBlocked: false });
    console.log(products);
    res.render("user/shop", { products });
  } catch (error) {
    console.error(error);
  }
};

//product detail page
exports.productDetails = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    const prod = await Product.find({ isBlocked: false });
    if (!products) {
      res.status(400).json({ error: "product not found" });
    }
    res.render("user/productDetails", { products, prod });
  } catch (error) {
    console.error(error);
  }
};


