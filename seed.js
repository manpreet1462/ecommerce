//for sending data/documents to our db
const mongoose=require('mongoose')
const Product= require ('./models/Product')
const products=[
    {
        name:"iphone 15 pro max"  ,
        img: "https://images.unsplash.com/photo-1695048065061-0271cbfcd037?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  ,
        price: 124000 ,
        desc: "very costly"
    },
    {
        name: "macbook pro"  ,
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  ,
        price: 110000,
        desc: "very sleak and easy to use"
    },
    {
        name: "apple watch" ,
        img: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  ,
        price: 56000 ,
        desc: "a lot of features"
    }
]


async function seedDB(){
    await Product.insertMany(products);
    console.log("DB succesfully Seeded");
}

module.exports=seedDB

