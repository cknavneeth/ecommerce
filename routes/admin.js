const express=require("express")
const router=express.Router()
const adminController=require("../controller/admin/adminController")

const customerController=require("../controller/admin/customerController")
const categoryController=require("../controller/admin/categoryController")
const productController=require("../controller/admin/productController")


router.get("/admin",(req,res)=>{
    res.render("admin/adminLogin",{error:null})
})


router.post("/adminLogin",adminController.loginRedirect)

router.get("/dashboard",adminController.dashboardRedirect)


router.get('/users', customerController.listCustomers);

router.get('/block',customerController.blocking)

router.get('/unblock',customerController.unblocking)

router.get('/category',categoryController.categoryInfo)

router.post('/addCategory',categoryController.addCategory)

// router.get('/editCategory',categoryController.getEditCategory)
router.get('/editCategory', categoryController.getEditCategory);


router.post('/editCategory/:id',categoryController.editCategory)

//for deleting category
router.post('/deleteCategory/:id',categoryController.deleteCat)

//if you wanna restore you wanna activate this route
// router.post('/restoreCategory/:id/restore',categoryController.restoreCat)


//now its time to addproducts
router.get('/addProducts',productController.getProduct)





module.exports=router