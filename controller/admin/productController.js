const Product=require('../../models/productModel.js')
const Category=require('../../models/categoryModel.js')
const User=require('../../models/userModel.js')
const fs=require("fs")
const path=require("path")
const sharp=require("sharp")


exports.getProduct=async(req,res)=>{
    try {
        const category=await Category.find({isDeleted:false})
        res.render('admin/addProduct',{
            cat:category
        })
    } catch (error) {
        res.redirect('/pageerror')
    }
}
