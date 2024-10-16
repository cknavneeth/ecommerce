const express=require("express")
const router=express.Router()
const multer = require('multer');
const storage = require("../helpers/multer");
const passport=require('passport')
const {verifyAdmin}=require('../middleware/adminMiddleware')
const {AdminLoggedIn}=require('../middleware/adminMiddleware')

// const uploads=multer({storage:storage})
const uploads = require("../helpers/multer");
const adminController=require("../controller/admin/adminController")

const customerController=require("../controller/admin/customerController")
const categoryController=require("../controller/admin/categoryController")
const productController=require("../controller/admin/productController")
// const {adminLoggedIn}=require('../middleware/adminMiddleware')


router.get("/admin",AdminLoggedIn,(req,res)=>{
  return  res.render("admin/adminLogin",{error:null})
})


router.post("/adminLogin",adminController.loginRedirect)

router.get("/dashboard",adminController.dashboardRedirect)


router.get('/users',verifyAdmin, customerController.listCustomers);

router.get('/block',verifyAdmin,customerController.blocking)

router.get('/unblock',verifyAdmin,customerController.unblocking)

router.get('/category',verifyAdmin,categoryController.categoryInfo)

router.post('/addCategory',verifyAdmin,categoryController.addCategory)

// router.get('/editCategory',categoryController.getEditCategory)
router.get('/editCategory',verifyAdmin, categoryController.getEditCategory);


router.post('/editCategory/:id',verifyAdmin,categoryController.editCategory)

//for deleting category
router.post('/deleteCategory/:id',verifyAdmin,categoryController.deleteCat)

//if you wanna restore you wanna activate this route
// router.post('/restoreCategory/:id/restore',categoryController.restoreCat)


//now its time to addproducts
router.get('/addProducts',verifyAdmin,productController.getProduct)

router.post("/addProducts",verifyAdmin,uploads.array("images",4),productController.addProducts)

//listing products
router.get('/products',productController.getAllProducts)

//add offer in products
router.post('/addProductOffer',productController.addProductOffer)

//remove offer in products
router.post('/removeProductOffer',productController.removeProductOffer)

//block product
router.get('/blockProduct',productController.blockProduct)
//unblock product
router.get('/unBlockProduct',productController.unblockProduct)

//get edit page
router.get('/editProduct',productController.getEditProduct)

router.post('/editProduct/:id',uploads.array('images',4),productController.editProduct)

//single single image
router.post('/deleteImage',productController.deleteSingleImage)

//continue with google
// router.get('/auth/google',passport.authenticate('google',{scope:['profile,email']}))
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/index')
    // console.log(req.)
})
// router.get('/auth/google/callback',passport.authenticate('local', function(err, user) {
//     if (!user) { return res.redirect('/login'); }
//     res.end('Authenticated!');
//   })(req, res)
// )
router.post('/adminLogout',adminController.adminLogout)







module.exports=router