const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

verifyUser = async (req, res, next) => {
  let token = req.cookies.token;
  if (token) {
    try {
      const decode = jwt.verify(token, "dididi");
      const lalu = await User.findById(decode.id).select("-password");
      console.log(lalu);
      next();
    } catch (error) {
      console.error(error);
      res.status(400).redirect("/");
    }
  } else {
    res.status(400);
  }
};

module.exports = verifyUser;
