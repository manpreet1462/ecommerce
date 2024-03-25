let allLikeButton = document.querySelectorAll('.like-btn');

async function likeButton(productId){
    try{
        let response=await axios({
            method: 'post',
            url: `/products/${productId}/like`,
            headers : {'X-Requested-With' : 'XMLHttpRequest'}
        })  
        if(btn.children[0].classList.contains('fa-regular')){
            btn.children[0].classList.remove('fa-regular');
            btn.children[0].classList.add('fa-solid');
        }else{
            btn.children[0].classList.remove('fa-solid');
            btn.children[0].classList.add('fa-regular'); 
        }
        
    }
    catch(e){
        window.location.replace('/login');
    }
}

for(let btn of allLikeButton){
    btn.addEventListener('click',(req,res)=>{
        let productId=btn.getAttribute('product-id'); 
        likeButton(productId);
    })
}