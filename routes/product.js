const express=require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateProduct,isLoggedIn, isSeller, isProductAuthor } = require('../middleware');
const User = require('../models/User');
//as in app.js we have app which is a big application and it cannot be export easily so we have mini application here which is k.a ROUTER
const router=express.Router( )

//showing all the producs
router.get('/products',async(req,res)=>{
    try{
        let products= await Product.find({});
        res.render('index',{products} )
    }
    catch(e){
        res.render('error',{err:e.message})
    }
});


//new form for new products
router.get('/products/new',isLoggedIn,isSeller,(req,res)=>{
    try{
        res.render('new')
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})

//actually adding the products
router.post('/products',isLoggedIn,validateProduct,async(req,res)=>{
    try{
        let {name ,img ,price ,desc} = req.body;  //by default undef ...to avoid this we add a middleware in app.js  
        await Product.create({name,img,price,desc,author:req.user._id})
        req.flash('success','product added succussfully') 
        res.redirect('/products')
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})

//to show a particular product
router.get('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        let {id}=req.params;
        let product=await Product.findById(id).populate('review');
        res.render('show',{product,success:req.flash('msg')})
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})


//show edit form
router.get('/products/:id/edit',isLoggedIn,isSeller ,async(req,res)=>{
    try{
        let {id}=req.params;
        let product=await Product.findById(id);
        res.render('edit',{product})
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})

//to actually update the edit done in form
router.patch('/products/:id',isLoggedIn,isSeller,isProductAuthor,async(req,res)=>{
    try{
        let {id}=req.params;
        let {name ,img ,price ,desc} = req.body;
        await Product.findByIdAndUpdate(id, {name ,img ,price ,desc});
        req.flash('success','product edited succesfully');
        res.redirect('/products');
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})


//for deleting the product
router.delete('/products/:id',isLoggedIn,isSeller,isProductAuthor,async(req,res)=>{
    try{
        let {id}=req.params;
        let product=await Product.findById(id);
         // Get all users who have this product in their cart
         const usersWithProduct = await User.find({ cart: id });

        //deleting reviews before deleting product nhi to reviews ke collection mei reviews reh jayenge
        for(let ids of product.review){
            await Review.findByIdAndDelete(ids);
        }
        // Update each user's cart to remove the product
        const updatePromises = usersWithProduct.map(async (user) => {
            user.cart = user.cart.filter(itemId => itemId.toString() !== id.toString());
            await user.save();
        });
        await Promise.all(updatePromises);

        await Product.findByIdAndDelete(id)
        res.redirect('/products')
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})





module.exports= router;