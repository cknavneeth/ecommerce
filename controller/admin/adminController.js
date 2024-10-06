const Admin = require('../../models/adminModel.js');

const mongoose=require("mongoose")

// exports.loginRedirect = async (req, res) => {
//     const { email, password } = req.body;
//   console.log(email,password)
//     try {
//       const admin = await Admin.findOne({ email });
//   console.log("lalu:",email)
//       if (admin && await admin.matchPassword(password)) {

//         // if (admin.role === 'admin') {
//         console.log(email)
//         console.log("gerbil",password)
          
//           return res.redirect('admin/dashboard');
//         //  else {
//         //   // If the user is not an admin
//         //   return res.render('admin/adminLogin', { error: 'Unauthorized access' });
//         // }
//       } else {
//         return res.render('admin/adminLogin', { error: 'Invalid login credentials' });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).render('admin/adminLogin', { error: 'Something went wrong. Please try again.' });
//     }
//   };
  

exports.loginRedirect = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  try {
      const admin = await Admin.findOne({ email });
      console.log(admin)
    //   req.session.admin_Id=admin._id

      if (!admin) {
          return res.render('admin/adminLogin', { error: 'Invalid login credentials' });
      }

      
      const isMatch = await admin.matchPassword(password);
      if (isMatch) {
          console.log("Login successful");

          return res.redirect('/dashboard');
      } else {
          return res.render('admin/adminLogin', { error: 'Invalid login credentials' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).render('admin/adminLogin', { error: 'Something went wrong. Please try again.' });
  }
};


exports.dashboardRedirect = (req, res) => {
  return res.render("admin/dashboard");
};
   
