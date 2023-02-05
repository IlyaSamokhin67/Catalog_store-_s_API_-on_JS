const API_URL = "https://fakestoreapi.com";

class API {
   async addProductTOCart(productId) {
      const body = JSON.stringify({
         products: [{ productId, quantity: 1 }]
      });

      await fetch(`${API_URL}/carts/7`,{
         method: "POST",
         body
      });
   }

   async fetchAllProducts(params = {}){
      const queryParams = new URLSearchParams(params);
      const res = await fetch (`${API_URL}/products?${queryParams.toString()}`);
      const products = await res.json();

      return products;
   }
}

const api = new API();

function handleError(err){
   console.log(err);
   alert("Возникла ошибка при отправки запроса");
}

async function renderProducts(){
   try{
      const productsList = document.querySelector(".products_list");
      const products = await api.fetchAllProducts({ limit:10 });

      products.forEach((product) => {
         const productListImg = document.createElement('img')
         const productListItem = document.createElement("li");
         const productListPrice = document.createElement("span");
         const productAddBtn = document.createElement("button");
      
         productListImg.classList.add("products_img");
         productListImg.src = product.image;
         
         productListItem.classList.add("products_item");
         productListItem.textContent = product.title;

         productListPrice.classList.add("products_price");
         productListPrice.textContent = product.price +"$";
         
         productAddBtn.classList.add("products_addBtn");
         productAddBtn.textContent = "Заказать"
         productAddBtn.setAttribute("data-product-id", product.id);

         productListItem.append(productListImg);
         productListItem.append(productListPrice);
         productListItem.append(productAddBtn);
         productsList.append(productListItem);
         

      });
   } catch (err) {
      handleError(err);
   }
}




window.addEventListener("load", function(){
   renderProducts();
   const productsList = document.querySelector(".products_list");

   productsList.addEventListener("click", async function(event){
      if(event.target.tagName === "BUTTON"){
         try{
         event.target.disabled = true;
         await api.addProductTOCart(
            event.target.getAttribute("data-product-id")
            );
               event.target.textContent = "Заказ добавлен";
            }catch(err){
               event.target.disabled = false;
            }
         }   
   });
});