// ROYAL FOOD VILLA - FINAL WORKING - BALAY 24150892008 - SAVES TO LocalStorage
const FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
let defaultFoods = [
{name:"Chicken Biryani",price:280,reviews:120,stars:"★★★★",cat:"Biryani",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500"},
{name:"Beef Biryani",price:320,reviews:95,stars:"★★",cat:"Biryani",img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"},
{name:"Classic Burger",price:220,reviews:210,stars:"★★★",cat:"Chicken",img:"https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500"},
{name:"Cheese Burger",price:260,reviews:150,stars:"★★★★",cat:"Chicken",img:"https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500"},
{name:"Fuchka",price:80,reviews:300,stars:"★★★★★",cat:"Street",img:"https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=500"},
{name:"Chotpoti",price:90,reviews:200,stars:"★★★★",cat:"Street",img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500"}
];
let foods = JSON.parse(localStorage.getItem('royal_foods_v8') || 'null') || defaultFoods;
let cart = JSON.parse(localStorage.getItem('royal_cart') || '[]');
let orders = JSON.parse(localStorage.getItem('royal_orders') || '[]');

function saveAll(){
localStorage.setItem('royal_foods_v8', JSON.stringify(foods));
localStorage.setItem('royal_cart', JSON.stringify(cart));
localStorage.setItem('royal_orders', JSON.stringify(orders));
updateStats();
}
function updateStats(){
let totalOrders = orders.length + 128;
let revenue = orders.reduce((s,o)=>s+o.total,0) + 24560;
document.getElementById('statOrders').innerText = totalOrders;
document.getElementById('statRevenue').innerText = revenue.toLocaleString() + ' BDT';
document.getElementById('statPending').innerText = orders.length + 7;
document.getElementById('menuCount').innerText = foods.length + ' Items';
}
function renderFoods(){
let term = document.getElementById('searchInput').value.toLowerCase();
let list = foods.filter(f => f.name.toLowerCase().includes(term));
document.getElementById('foodGrid').innerHTML = list.slice(0,3).map((f,i)=>{
let realIdx = foods.indexOf(f);
return `<div class="food-card"><img src="${f.img}" onerror="this.src='${FALLBACK_IMG}'"><div class="info"><div class="fname">${f.name}</div><div class="stars">${f.stars} (${f.reviews})</div><div class="fprice">${f.price} BDT</div><button class="${realIdx==0?'btn-gold':'btn-outline'}" onclick="addToCart(${realIdx})">+ Add to Cart</button></div></div>`;
}).join('');
}
function renderCart(){
document.getElementById('cartCount').innerText = cart.reduce((s,x)=>s+x.qty,0);
let sub = cart.reduce((s,x)=>s+x.price*x.qty,0);
document.getElementById('subTotal').innerText = sub + ' BDT';
document.getElementById('totalPrice').innerText = (sub + 60 - 20) + ' BDT';
document.getElementById('mSub').innerText = sub + ' BDT';
document.getElementById('mTotal').innerText = (sub + 60 - 20) + ' BDT';
if(cart.length==0){
document.getElementById('cartList').innerHTML = '<p style="color:#666;font-size:12px;text-align:center;padding:20px 0">Cart empty - Add from menu<br>Data saves in LocalStorage</p>';
return;
}
document.getElementById('cartList').innerHTML = cart.map((c,i)=>`<div class="cart-item"><img src="${c.img}" onerror="this.src='${FALLBACK_IMG}'"><div style="flex:1"><div class="c-name">${c.name}</div><div class="c-meta">1 x ${c.price} BDT • Qty ${c.qty}</div></div><div style="text-align:right"><div style="font-size:12px">${c.price*c.qty} BDT</div><button onclick="removeCart(${i})" style="background:none;border:none;color:#777;cursor:pointer;font-size:12px;margin-top:4px">🗑️ Remove</button></div></div>`).join('');
}
function addToCart(idx){let f = foods[idx];let ex = cart.find(x=>x.name==f.name);if(ex) ex.qty++;else cart.push({name:f.name,price:f.price,img:f.img,qty:1});saveAll(); renderCart();}
function removeCart(i){ cart.splice(i,1); saveAll(); renderCart(); }
function clearCart(){ cart=[]; saveAll(); renderCart(); }
function renderRecent(){
let demo = [
{id:'#RFV1028',cust:'Rahim K.',img:'https://i.pravatar.cc/24?img=5',item:'Chicken Biryani',amt:'280 BDT',status:'Pending'},
{id:'#RFV1027',cust:'Nusrat F.',img:'https://i.pravatar.cc/24?img=6',item:'Beef Biryani',amt:'320 BDT',status:'Completed'},
{id:'#RFV1026',cust:'Tanvir A.',img:'https://i.pravatar.cc/24?img=7',item:'Classic Burger',amt:'220 BDT',status:'Preparing'}
];
let all = [...orders.map(o=>({id:o.orderId,cust:o.customer,item:o.items[0]?.name||'Mixed',amt:o.total+' BDT',status:'Pending'})), ...demo];
document.getElementById('recentOrders').innerHTML = all.slice(0,6).map(o=>{
let cls = o.status=='Completed'?'completed':o.status=='Preparing'?'preparing':'pending';
return `<div class="row-item"><span><b>${o.id}</b></span><span style="display:flex;gap:6px;align-items:center"><img src="${o.img||'https://i.pravatar.cc/24'}" style="width:20px;height:20px;border-radius:50%">${o.cust}</span><span style="color:#888">${o.item}</span><span>${o.amt}</span><span><span class="status ${cls}">● ${o.status}</span></span></div>`;
}).join('');
}
function openCheckout(){if(cart.length==0){alert('Cart empty! Add Chicken Biryani or Burger first');return;}document.getElementById('checkoutModal').classList.add('active');}
function closeCheckout(){document.getElementById('checkoutModal').classList.remove('active');}
function confirmOrder(){
let name=document.getElementById('cName').value.trim();
let phone=document.getElementById('cPhone').value.trim();
let addr=document.getElementById('cAddress').value.trim();
let pay=document.getElementById('cPayment').value;
if(!name||!phone||!addr){alert('Please fill Name, Phone, Address - Required for Sir to check');return;}
let sub=cart.reduce((s,x)=>s+x.price*x.qty,0);
let total=sub+60-20;
let orderId='ROYAL-'+Math.floor(10000+Math.random()*90000);
let order={orderId,items:[...cart],subtotal:sub,delivery:60,discount:20,total,customer:name,phone,address:addr,payment:pay,date:new Date().toLocaleString(),status:'Pending'};
orders.unshift(order);saveAll();closeCheckout();cart=[];saveAll();renderCart();renderRecent();
document.getElementById('invId').innerText=orderId;document.getElementById('invName').innerText=name;document.getElementById('invPhone').innerText=phone;document.getElementById('invAddr').innerText=addr;document.getElementById('invPay').innerText=pay;document.getElementById('invDate').innerText=order.date;document.getElementById('invItems').innerHTML=order.items.map(it=>`<div><span>${it.name} x ${it.qty}</span><span>${it.price*it.qty} BDT</span></div>`).join('') + `<div><span>Delivery Fee</span><span>60 BDT</span></div><div><span>Discount</span><span>-20 BDT</span></div>`;document.getElementById('invTotal').innerText=total+' BDT';document.getElementById('invoiceModal').classList.add('active');
}
function closeInvoice(){document.getElementById('invoiceModal').classList.remove('active');}
function applyPromo(){let code=document.getElementById('promoInput').value.toUpperCase();let msg=document.getElementById('promoMsg');if(code=='BALAY10'){msg.innerText='✅ BALAY10 Applied! 10% OFF - ID 24150892008';}else if(code==''){msg.innerText='Enter BALAY10';}else{msg.innerText='❌ Invalid! Try BALAY10';}}
document.getElementById('searchInput').addEventListener('input', renderFoods);
renderFoods(); renderCart(); renderRecent(); updateStats();
