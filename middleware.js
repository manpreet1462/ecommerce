//Creating this because server side validation needs to be done before doing any activity...example if we are adding a new product so before
// adding the product we needs to check the server, so middleware will come in between to check these things.


const Product = require('./models/Product');
const {productSchema, reviewSchema}=require('./schema')


const validateProduct=(req,res,next)=>{
    try{
        let {name ,img ,price ,desc} = req.body;
        let {err}=productSchema.validate({name,img,price,desc});
        if(err){
            const msg=err.details.map((err)=>err.message).join(',');
            return res.render('error',{err:msg})
        }
        next();
    }
    catch(e){
        console.log(e);
        res.render('error',{err:e.message})
    }
}


const validateReview=(req,res,next)=>{
    
    try{
        let {rating,comments}=req.body;
        let {error}= reviewSchema.validate({rating,comments});
        if(error){
            const msg=error.details.map((err)=>err.message).join(',');
            return res.render('error',{err:msg})
        }
        next();
    }
    catch(e){
        console.log(e);
        res.render('error',{err:e.message})
    }
}


const isLoggedIn=(req,res,next)=>{
    try{
        if(!req.isAuthenticated()){
            
            req.flash('error','You need to login first')
            res.redirect('/login');
        }
        else{
            next();
        }
    }
    catch(e){
        console.log(e);
        res.render('error',{err:e.message})
    }
}

const isSeller= (req,res,next)=>{
    if(!req.user.role){
        req.flash('error','You do not have the permissions');
        res.redirect('/products')
    }
    else if(req.user.role !== "seller"){
        req.flash('error','You do not have the permissions');
        res.redirect('/products');
    }
    next();
}

const isProductAuthor= async(req,res,next)=>{
    let {id}=req.params;
    let product=await Product.findById(id);
    if(product.author.equals(req.user._id)){
        req.flash('error','You are not the owner of this product');
        return res.redirect(`/products`);
    }
    next
}

module.exports={validateProduct,validateReview,isLoggedIn,isSeller,isProductAuthor}

