const express=require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview ,isLoggedIn} = require('../middleware');
//as in app.js we have app which is a big application and it cannot be export easily so we have mini application here which is k.a ROUTER
const router=express.Router( )

router.post('/products/:id/rating',validateReview,isLoggedIn,async(req,res)=>{
    try{
        let {rating,comment}=req.body;
        let {id}=req.params;
        let product = await Product.findById(id)
        //new review chahiye in product
        let review=new Review({rating,comment});
        product.review.push(review);
        await product.save(); 
        await review.save();
        //adding flash messages 
        req.flash('success','Review added successfully!!');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.render('error',{err:e.message})
    }
})

module.exports= router;