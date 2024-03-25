const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middleware');
const Product = require('../models/Product');
const stripe = require('stripe')('sk_test_51Oxur7SIG5DmS74weeKEpguwbQ5mHLhU9jV6DukC69FHGAVCsBOrVIKe3Dre04hJarc3kkk8OqXO9JPSY91Lid8e00H2yMlMcC')

router.get('/user/cart', isLoggedIn, async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('cart');
      
      let totalAmount = 0;
      if (user.cart.length > 0) {
        totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
      }
  
      // Render the 'cart' view with data
      res.render('cart', { user, totalAmount });
    } catch (err) {
      console.error('Error fetching user cart:', err);
      res.status(500).send('Error fetching user cart');
    }
  });
  
  
  // Add product to user's cart route
  router.post('/user/:id/add', isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      
      // Find user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Find product by ID
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      // Add product to user's cart
      user.cart.push(product._id); // Assuming cart is an array of product IDs
      await user.save();
  
      res.redirect('/user/cart');
    } catch (err) {
      console.error('Error adding product to cart:', err);
      res.status(500).send('Error adding product to cart');
    }
  });




router.post('/cart/update', isLoggedIn, async (req, res) => {
    try {
        const { productId, action } = req.body;
        const user = req.user;

        // Check if productId and action are provided in the request
        if (!productId || !action) {
            return res.status(400).send('Invalid request data');
        }

        // Find the product index in the user's cart
        const cartItemIndex = user.cart.findIndex(item => item.product && item.product.equals(productId));

        if (cartItemIndex !== -1) {
            // Perform the appropriate action based on the action parameter
            if (action === 'increase') {
                user.cart[cartItemIndex].quantity++;
            } else if (action === 'decrease' && user.cart[cartItemIndex].quantity > 1) {
                user.cart[cartItemIndex].quantity--;
            }

            // Save the updated user object
            await user.save();
            return res.redirect('/user/cart');
        } else {
            return res.status(404).send('Product not found in cart');
        }
    } catch (err) {
        console.error('Error updating quantity:', err);
        return res.status(500).send('Error updating quantity');
    }
});




// Increment quantity of an item in the cart
router.post('/cart/increase/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params; // Product ID
        const user = req.user; // Assuming req.user contains the authenticated user

        // Find the product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the product is already in the user's cart
        const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(id));

        if (existingCartItemIndex !== -1) {
            // Increment quantity if the item is already in the cart
            user.cart[existingCartItemIndex].quantity++;
        } else {
            // Add the product to the cart with quantity 1 if it's not already in the cart
            user.cart.push({ product: id, quantity: 1 });
        }

        await user.save();
        res.redirect('/user/cart'); // Redirect to the cart page or any other desired page
    } catch (err) {
        console.error('Error increasing quantity:', err);
        res.status(500).send('Error increasing quantity');
    }
});

// Decrement quantity of an item in the cart
router.post('/cart/decrease/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params; // Product ID
        const user = req.user; // Assuming req.user contains the authenticated user

        // Find the index of the item in the cart
        const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(id));

        if (existingCartItemIndex !== -1) {
            // Decrease quantity if the item is in the cart and quantity > 1
            if (user.cart[existingCartItemIndex].quantity > 1) {
                user.cart[existingCartItemIndex].quantity--;
                await user.save();
            }
        }

        res.redirect('/user/cart'); // Redirect to the cart page or any other desired page
    } catch (err) {
        console.error('Error decreasing quantity:', err);
        res.status(500).send('Error decreasing quantity');
    }
});

//route for payments
router.get('/checkout/:id',async(req,res)=>{
    const userid = req.params.id;
    const user = await User.findById(userid).populate('cart');
    let totalAmount= user.cart.reduce((sum,curr)=> sum+curr.price,0 );

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: totalAmount*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
      });
    
      res.redirect(303, session.url);
})








module.exports = router;
