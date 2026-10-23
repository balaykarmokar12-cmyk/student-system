// ROYAL FOOD VILLA - FINAL FIX - EDIT ENABLE - BALAY 24150892008
let defaultFoods=[
{name:"Shingara (2pcs)",price:20,reviews:18,stars:"4.9",cat:"Street",img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500"},
{name:"Samosa",price:30,reviews:25,stars:"4.8",cat:"Street",img:"https://images.unsplash.com/photo-1534422298391-e4f199d3a72a?w=500"},
{name:"Fuchka (10pcs)",price:100,reviews:120,stars:"5.0",cat:"Popular",img:"https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?w=500"},
{name:"Chotpoti",price:80,reviews:200,stars:"4.9",cat:"Popular",img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500"},
{name:"Luchi Alur Dom",price:90,reviews:95,stars:"4.7",cat:"Breakfast",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500"},
{name:"Paratha Dal",price:50,reviews:80,stars:"4.6",cat:"Breakfast",img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500"},
{name:"Beef Biryani",price:220,reviews:95,stars:"4.5",cat:"Biryani",img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"},
{name:"Chicken Biryani",price:150,reviews:120,stars:"4.8",cat:"Biryani",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500"},
{name:"Kacchi Biryani",price:350,reviews:110,stars:"4.9",cat:"Biryani",img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500"},
{name:"Hilsa Bhapa",price:250,reviews:70,stars:"4.7",cat:"Fish",img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500"},
{name:"Chicken Tikka",price:290,reviews:85,stars:"4.8",cat:"Chicken",img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500"},
{name:"Rui Curry",price:180,reviews:60,stars:"4.5",cat:"Fish",img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"},
{name:"Grilled Chicken",price:320,reviews:130,stars:"4.9",cat:"Chicken",img:"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500"},
{name:"Morog Polao",price:200,reviews:90,stars:"4.7",cat:"Biryani",img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"}
];

let foods=JSON.parse(localStorage.getItem('royal_foods_v8')||'null')||defaultFoods;
let cart=JSON.parse(localStorage.getItem('royal_cart')||'[]');
let orders=JSON.parse(localStorage.getItem('royal_orders')||'[]');
let isAdmin=localStorage.getItem('royal_admin_v8')==='true';

function saveAll(){
localStorage.setItem('royal_foods_v8',JSON.stringify(foods));
localStorage.setItem('royal_cart',JSON.stringify(cart));
localStorage.setItem('royal_orders',JSON.stringify(orders));
}

// FIX: Render with Edit/Delete when Admin ON
function renderFoods(){
let term=(document.getElementById('searchInput')?.value||'').toLowerCase();
let cat=document.querySelector('.cat-active')?.dataset.cat||'All';
let list=foods.filter(f=>{
let matchName=f.name.toLowerCase().includes(term);
let matchCat=cat==='All'||f.cat===cat;
return matchName&&matchCat;
});
let grid=document.getElementById('foodGrid');
if(!grid) return;
grid.innerHTML=list.map((f,idx)=>{
let realIdx=foods.indexOf(f);
if(isAdmin){
// ADMIN ON - Show Edit/Delete + Add
return `<div class="food-card admin-card">
<img src="${f.img}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
<div class="info">
<div class="fname">${f.name}</div>
<div class="fcat">${f.cat} - ${f.stars}★ (${f.reviews})</div>
<div class="fprice">BDT ${f.price}</div>
<div class="admin-btns">
<button class="edit-btn" onclick="editFood(${realIdx})">✏️ Edit</button>
<button class="del-btn" onclick="deleteFood(${realIdx})">🗑️ Delete</button>
<button class="add-btn" onclick="addToCart(${realIdx})">Add</button>
</div>
</div></div>`;
}else{
// Normal User - Only Add
return `<div class="food-card">
<img src="${f.img}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
<div class="info">
<div class="fname">${f.name}</div>
<div class="fcat">Ingredients: ${f.cat}</div>
<div class="fprice">BDT ${f.price}</div>
<button class="add-btn" onclick="addToCart(${realIdx})">Add</button>
</div></div>`;
}
}).join('');
}

function editFood(idx){
let f=foods[idx];
let newName=prompt("Edit Food Name:", f.name);
if(!newName) return;
let newPrice=prompt("Edit Price BDT:", f.price);
if(!newPrice) return;
f.name=newName;
f.price=parseInt(newPrice);
saveAll(); renderFoods();
alert("✅ Edited! New: "+f.name+" - BDT "+f.price+" - Saved to LocalStorage");
}

function deleteFood(idx){
if(!confirm("Delete "+foods[idx].name+"?")) return;
foods.splice(idx,1);
saveAll(); renderFoods();
alert("🗑️ Deleted! Saved");
}

function addToCart(idx){let f=foods[idx];let ex=cart.find(x=>x.name==f.name);if(ex) ex.qty++;else cart.push({name:f.name,price:f.price,img:f.img,qty:1});saveAll();renderCart();}
function renderCart(){/* same as before */ let total=cart.reduce((s,x)=>s+x.price*x.qty,0); let el=document.getElementById('cartList'); if(el){ el.innerHTML=cart.map((c,i)=>`<div>${c.name} x ${c.qty} - BDT ${c.price*c.qty} <button onclick="removeCart(${i})">X</button></div>`).join(''); } let tot=document.getElementById('totalPrice'); if(tot) tot.innerText='BDT '+total; }
function removeCart(i){cart.splice(i,1);saveAll();renderCart();}

function adminLogin(){
let u=document.getElementById('adminUser')?.value||prompt("Username:");
let p=document.getElementById('adminPass')?.value||prompt("Password:");
if(u==='admin' && p==='balay2026'){
isAdmin=true;localStorage.setItem('royal_admin_v8','true');
alert("Admin Login Success! Now you can edit menu & see revenue");
location.reload();
}else alert("Wrong! Use admin / balay2026");
}
function adminLogout(){isAdmin=false;localStorage.removeItem('royal_admin_v8');location.reload();}

// Init
document.addEventListener('DOMContentLoaded',()=>{renderFoods();renderCart();});
