
(function () {
  "use strict";
  var IMAGE_ROOT = "https://raw.githubusercontent.com/jimaeirik-debug/HEART-NECKLACE-/main/";
  var PRODUCTS = {
    "necklace-heart-spoon": {id:"necklace-heart-spoon", name:"The Heart & Spoon Necklace", category:"jewelry", priceNok:null, available:false, note:"Archive — not currently available", photo:IMAGE_ROOT+"BUST.png"},
    "suede-handbag": {id:"suede-handbag", name:"The Suede Handbag", category:"handbags", priceNok:null, available:false, note:"Coming soon — photographs and details to follow", photo:null}
  };
  var page = document.body.getAttribute("data-page") || "home";
  var root = document.getElementById("site");
  var allowedPages = ["home","shop","handbags","jewelry","about","cart","checkout","success"];
  if (allowedPages.indexOf(page) < 0) page = "home";
  var storageKey = "heart-and-spooned-bag-v1";
  function loadCart() {
    try {
      var stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
      var clean = {};
      Object.keys(stored).forEach(function (id) {
        var qty = Number(stored[id]);
        if (PRODUCTS[id] && PRODUCTS[id].available === true && Number.isInteger(qty) && qty > 0 && qty <= 10) clean[id]=qty;
      });
      return clean;
    } catch (err) { return {}; }
  }
  function saveCart(c) { try {localStorage.setItem(storageKey, JSON.stringify(c));} catch (err) {} }
  function cartCount() {return Object.keys(loadCart()).reduce(function(n,id){return n+loadCart()[id];},0);}
  function money(n) {return new Intl.NumberFormat("en-NO",{style:"currency",currency:"NOK",maximumFractionDigits:0}).format(n);}
  function header() {
    var links = [["shop","SHOP ALL","/shop.html"],["handbags","HANDBAGS","/handbags.html"],["jewelry","JEWELRY","/jewelry.html"],["about","THE EDIT","/about.html"]];
    var desktop = links.map(function(l){return '<a class="header-link" href="'+l[2]+'"'+(page===l[0]?' aria-current="page"':'')+'>'+l[1]+'</a>';}).join("");
    var mobile = links.map(function(l){return '<a href="'+l[2]+'"'+(page===l[0]?' aria-current="page"':'')+'>'+l[1]+'</a>';}).join("");
    return '<div class="announcement">A CURATED WARDROBE OF UNUSUAL LITTLE THINGS &nbsp; · &nbsp; NEW FASHION EDIT IN PROGRESS</div>'+
     '<header class="site-header"><div class="header-inner"><nav aria-label="Primary navigation" class="nav-left">'+desktop+'</nav>'+
     '<a href="/" class="brand" aria-label="Heart and Spooned home">heart &amp; spooned.</a>'+
     '<nav class="nav-right" aria-label="Shopping bag"><a class="header-link" href="/cart.html"'+(page==="cart"?' aria-current="page"':'')+'>BAG <span class="bag-count" data-bag-count>'+cartCount()+'</span></a></nav></div>'+
     '<nav class="mobile-nav" aria-label="Mobile primary navigation">'+mobile+'</nav></header>';
  }
  function footer() {
    return '<footer class="site-footer"><div class="footer-top"><div><div class="eyebrow">AN INDEPENDENT FASHION EDIT</div><div class="footer-brand">heart &amp;<br><em>spooned.</em></div>'+
      '<p class="footer-description">Beautifully strange accessories, jewelry and objects worth keeping. A changing collection, not just one necklace.</p></div>'+
      '<div class="footer-col"><h4>EXPLORE</h4><a href="/shop.html">Shop all</a><a href="/handbags.html">Suede handbags</a><a href="/jewelry.html">Jewelry archive</a><a href="/about.html">Our story</a></div>'+
      '<div class="footer-col"><h4>YOUR ORDER</h4><a href="/cart.html">Shopping bag</a><a href="/checkout.html">Checkout information</a>'+
      '<p class="small" style="color:#d7bdc4;max-width:260px">Products and payment will become available once the new collection and secure checkout are ready.</p></div></div>'+
      '<div class="footer-bottom"><span>© '+new Date().getFullYear()+' HEART & SPOONED</span><span>INDEPENDENT FASHION OBJECTS · ONLINE STORE IN PREPARATION</span></div></footer>';
  }
  function suedeVisual() {
    return '<div class="suede-visual" role="img" aria-label="Editorial placeholder for upcoming suede handbag collection; not a product photograph"><span class="suede-letter">Suede<br>studies.</span><span class="suede-small">AN EDIT IN PROGRESS — PRODUCT PHOTO TO FOLLOW</span></div>';
  }
  function collectionCard(title,sub,href,media,label) {
    return '<a class="collection-card" href="'+href+'"><div class="card-media"><span class="pill">'+label+'</span>'+media+'</div>'+
      '<div class="card-info"><h3>'+title+'</h3><span>'+sub+' &nbsp; ↗</span></div></a>';
  }
  function home() {
    return '<main id="main"><section class="home-hero"><div class="home-copy"><span class="eyebrow">THE OBJECTS OF DESIRE EDIT — NO. 001</span>'+
    '<h1>Good things<br><em>have</em> a little<br><em>strangeness.</em></h1>'+
    '<p>Not just jewelry. Heart &amp; Spooned is becoming a home for expressive handbags, accessories and small objects with a point of view.</p>'+
    '<div class="hero-actions"><a class="btn" href="/shop.html">DISCOVER THE EDIT <span aria-hidden="true">↗</span></a><a class="link-underline" href="/handbags.html">SUede handbags, soon</a></div></div>'+
    '<div class="hero-visual"><img src="'+IMAGE_ROOT+'BUST.png" alt="Ornate gold heart pendant photographed on rich burgundy velvet" fetchpriority="high">'+
    '<span class="image-label">FROM THE JEWELRY ARCHIVE · NOT FOR SALE</span></div></section>'+
    '<div class="issue-strip"><div>01 / FASHION ACCESSORIES</div><div>02 / OBJECTS WITH CHARACTER</div><div>03 / MORE TO COME</div></div>'+
    '<section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">SHOP BY CHAPTER</div><h2>Two sides of<br><em>the story.</em></h2></div><p>One collection in the making, one from our archive. Explore the worlds while we prepare the next release.</p></div>'+
    '<div class="collection-grid">'+
    collectionCard('Suede Handbags','COMING SOON','/handbags.html',suedeVisual(),'NEXT CHAPTER')+
    collectionCard('The Jewelry Archive','EXPLORE','/jewelry.html','<img src="'+IMAGE_ROOT+'necklace-on-velvet.png" alt="Gold heart pendant necklace resting on velvet" loading="lazy">','FROM THE ARCHIVE')+
    '</div></div></section>'+
    '<section class="editorial-split"><div class="editorial-photo"><img src="'+IMAGE_ROOT+'luxury-necklace-on-velvet%20(1).png" alt="Detail of a gold heart and spoon necklace on velvet" loading="lazy"></div>'+
    '<div class="editorial-copy"><div class="eyebrow">THE HEART & SPOONED POINT OF VIEW</div><h2>More than<br><em>one little<br>obsession.</em></h2><p>A fashion edit for the things you keep coming back to: texture, unusual details, a dash of romance and objects that say something.</p><a class="btn btn-light" href="/about.html">ABOUT THE EDIT <span aria-hidden="true">↗</span></a></div></section>'+
    '<section class="signup-note"><div class="eyebrow">THE NEXT CHAPTER</div><h2>Suede. Softness.<br><em>Something new.</em></h2><p>The handbag collection is in development. We’ll share the real photographs, details and pricing when it is ready.</p><a class="link-underline" href="/handbags.html">EXPLORE THE HANDBAG EDIT ↗</a></section></main>';
  }
  function productTile(item) {
    var media=item.photo?'<img src="'+item.photo+'" loading="lazy" alt="'+item.name+' product photography">':suedeVisual();
    return '<article class="product-tile" data-category="'+item.category+'"><a href="'+(item.category==="jewelry"?'/jewelry.html':'/handbags.html')+'"><div class="tile-photo">'+
      '<span class="pill">'+(item.available?'AVAILABLE':item.category==="jewelry"?'ARCHIVE':'COMING SOON')+'</span>'+media+'</div></a>'+
      '<div style="display:flex;justify-content:space-between;gap:15px;align-items:baseline"><h2 class="tile-title">'+item.name+'</h2><span class="status">'+(item.available?money(item.priceNok):"NOT FOR SALE")+'</span></div>'+
      '<p>'+item.note+'</p><p style="margin-top:12px"><a class="link-underline" href="'+(item.category==="jewelry"?'/jewelry.html':'/handbags.html')+'">VIEW THE STORY ↗</a></p></article>';
  }
  function shop() {
    return '<main id="main"><section class="page-intro"><div class="container"><div class="eyebrow">THE FASHION EDIT</div><h1>Shop <em>the edit.</em></h1>'+
      '<p>Handbags, jewelry and unusual accessories, collected with an eye for the unexpected. The next drop is being prepared; no products are currently available to purchase.</p></div></section>'+
      '<div class="container"><div class="shop-filters" role="group" aria-label="Filter collections"><button class="filter-chip active" data-filter="all" aria-pressed="true">ALL</button>'+
      '<button class="filter-chip" data-filter="handbags" aria-pressed="false">HANDBAGS</button><button class="filter-chip" data-filter="jewelry" aria-pressed="false">JEWELRY</button></div>'+
      '<div class="shop-grid" id="product-grid">'+productTile(PRODUCTS["suede-handbag"])+productTile(PRODUCTS["necklace-heart-spoon"])+'</div></div></main>';
  }
  function handbags() {
    return '<main id="main"><section class="bag-feature"><div>'+suedeVisual()+'</div><div class="bag-copy"><div class="eyebrow">COMING SOON / ACCESSORIES</div>'+
      '<h1>The suede<br><em>handbag.</em></h1><p>Soft texture. An expressive accessory. Our next chapter is handbags — starting with suede.</p>'+
      '<p class="status" style="margin:18px 0 25px">PRODUCT PHOTOS, DETAILS & PRICING TO FOLLOW</p>'+
      '<a href="/shop.html" class="btn btn-outline">EXPLORE ALL COLLECTIONS ↗</a></div></section>'+
      '<section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">THE BAG EDIT</div><h2>Under<br><em>construction.</em></h2></div></div>'+
      '<div class="note-list"><div><div class="eyebrow">01 / MATERIAL</div><h3>Suede</h3><p>The opening material direction for the handbag collection.</p></div>'+
      '<div><div class="eyebrow">02 / DETAILS</div><h3>To be revealed</h3><p>Measurements, colors and hardware will be confirmed alongside real product photographs.</p></div>'+
      '<div><div class="eyebrow">03 / AVAILABILITY</div><h3>Not released</h3><p>Ordering will open only once the product and secure checkout are ready.</p></div></div></div></section></main>';
  }
  function jewelry() {
    return '<main id="main"><section class="archive-panel"><div class="archive-main"><img src="'+IMAGE_ROOT+'BUST.png" alt="Heart and spoon gold necklace on burgundy display bust"></div>'+
      '<div class="archive-copy"><div class="eyebrow">JEWELRY / THE ARCHIVE</div><h1>A heart<br><em>with a secret.</em></h1>'+
      '<p>An ornate heart, beaded chain and a miniature screw-in spoon. A look back at a piece from the original Heart &amp; Spoon story.</p>'+
      '<div class="status" style="margin-top:15px">ARCHIVE ONLY — NOT AVAILABLE FOR PURCHASE</div>'+
      '<p class="archive-note">This piece is displayed as an archive. We are not accepting orders for it. Explore the new accessories collection instead.</p>'+
      '<a class="btn btn-outline" href="/handbags.html">DISCOVER THE NEXT CHAPTER ↗</a></div></section>'+
      '<section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">LOOK CLOSER</div><h2>The original<br><em>photo story.</em></h2></div></div>'+
      '<div class="archive-gallery">'+
      ['necklace-on-velvet.png','luxury-necklace-on-velvet%20(1).png','luxury-necklace-on-velvet.png','luxury-necklace.png'].map(function(f,i){return '<img src="'+IMAGE_ROOT+f+'" loading="lazy" alt="Archival necklace photograph '+(i+1)+'">';}).join('')+
      '</div></div></section></main>';
  }
  function about() {
    return '<main id="main"><div class="container"><section class="story-layout"><div><div class="eyebrow">HEART & SPOONED / THE STORY</div>'+
      '<h1>For the<br><em>things we</em><br>adore.</h1>'+
      '<p>Heart &amp; Spooned began with an affection for unexpected jewelry details. Now the idea is expanding into a broader fashion edit: bags, accessories and expressive objects with character.</p>'+
      '<p>We like romance without the rules, everyday things with unusual details, and materials that feel as interesting as they look.</p>'+
      '<a class="btn btn-outline" href="/shop.html">EXPLORE THE COLLECTION ↗</a></div>'+
      '<div class="story-aside"><span>Worth<br>keeping.</span></div></section></div></main>';
  }
  function emptyBag() {
    return '<div class="cart-empty"><div class="eyebrow">YOUR SELECTION</div><h2 class="serif" style="font-size:clamp(44px,6vw,70px);font-weight:400;margin:15px 0">Your bag is empty.</h2>'+
      '<p>Our next collection is still being prepared. Browse the edit, and return once product photos, prices and secure checkout are ready.</p>'+
      '<a class="btn" href="/shop.html" style="margin-top:22px">EXPLORE THE EDIT ↗</a></div>';
  }
  function cart() {
    var c=loadCart(), ids=Object.keys(c);
    if(!ids.length)return '<main id="main"><div class="container bag-page"><div class="eyebrow">THE SHOPPING BAG</div><h1>Your <em>bag.</em></h1><div class="thin-rule"></div>'+emptyBag()+'</div></main>';
    var total=0;
    var elements=ids.map(function(id){var p=PRODUCTS[id];var line=p.priceNok*c[id];total+=line;return '<div class="cart-item"><div><strong>'+p.name+'</strong><p class="muted">Quantity: '+c[id]+'</p></div><div>'+money(line)+' <button type="button" data-remove="'+id+'" class="link-underline" style="margin-left:16px;background:none;border:0">REMOVE</button></div></div>';}).join('');
    return '<main id="main"><div class="container bag-page"><div class="eyebrow">THE SHOPPING BAG</div><h1>Your <em>bag.</em></h1><div class="cart-items">'+elements+'</div>'+
      '<div class="cart-summary"><p><strong>Subtotal</strong><strong>'+money(total)+'</strong></p><p class="small muted">Shipping and taxes are calculated by secure checkout.</p>'+
      '<a class="btn" href="/checkout.html" style="width:100%">CONTINUE TO CHECKOUT ↗</a></div></div></main>';
  }
  function checkout() {
    var c=loadCart(), ids=Object.keys(c);
    var action=ids.length ? '<p style="margin-top:30px"><button type="button" id="start-checkout" class="btn">CONTINUE TO SECURE PAYMENT ↗</button><span class="small muted" id="checkout-feedback" aria-live="polite" style="display:block;margin-top:14px"></span></p>' : "";
    return '<main id="main"><div class="container bag-page"><div class="eyebrow">PAYMENTS / HEART & SPOONED</div><h1>Secure <em>checkout.</em></h1>'+
      '<div class="message">Online ordering is not open yet. We are connecting the payment provider and configuring shipping, taxes and the new product collection. No payment will be taken on this page.</div>'+
      '<div class="process-grid"><div><div class="eyebrow">01</div><h3>Choose a piece</h3><p class="muted small">Only released, in-stock products can be added to the bag.</p></div>'+
      '<div><div class="eyebrow">02</div><h3>Confirm delivery</h3><p class="muted small">Shipping options and any applicable taxes will be presented before payment.</p></div>'+
      '<div><div class="eyebrow">03</div><h3>Pay securely</h3><p class="muted small">Checkout will be hosted by our payment provider when ordering opens.</p></div></div>'+
      action+'<p style="margin-top:38px"><a href="/shop.html" class="btn btn-outline">RETURN TO THE COLLECTION ↗</a></p>'+
      '<p class="small muted" style="margin-top:20px">Bag items: '+ids.length+'. The payment service is not yet active.</p></div></main>';
  }
  function success() {
    return '<main id="main"><div class="container bag-page"><div class="eyebrow">PAYMENT STATUS</div><h1>Thank <em>you.</em></h1>'+
      '<div class="message">This page alone does not confirm an order or payment. Please check the payment provider’s confirmation email or contact the shop if you need assistance.</div>'+
      '<p style="margin-top:32px"><a class="btn btn-outline" href="/">BACK TO HOME ↗</a></p></div></main>';
  }
  var pageBuilders={home:home,shop:shop,handbags:handbags,jewelry:jewelry,about:about,cart:cart,checkout:checkout,success:success};
  root.innerHTML=header()+pageBuilders[page]()+footer();
  if(page==="shop"){
    Array.prototype.forEach.call(document.querySelectorAll("[data-filter]"),function(btn){
      btn.addEventListener("click",function(){
        var chosen=btn.getAttribute("data-filter");
        Array.prototype.forEach.call(document.querySelectorAll("[data-filter]"),function(b){var selected=b===btn;b.classList.toggle("active",selected);b.setAttribute("aria-pressed",String(selected));});
        Array.prototype.forEach.call(document.querySelectorAll(".product-tile"),function(t){t.style.display=(chosen==="all"||t.getAttribute("data-category")===chosen)?"":"none";});
      });
    });
  }
  if(page==="cart"){
    Array.prototype.forEach.call(document.querySelectorAll("[data-remove]"),function(btn){
      btn.addEventListener("click",function(){var c=loadCart();delete c[btn.getAttribute("data-remove")];saveCart(c);location.reload();});
    });
  }
  if(page==="checkout"){
    var button=document.getElementById("start-checkout");
    if(button) button.addEventListener("click",async function(){
      var feedback=document.getElementById("checkout-feedback");
      button.disabled=true;feedback.textContent="Connecting to secure checkout…";
      try{
        var bag=loadCart(),items=Object.keys(bag).map(function(id){return {id:id,quantity:bag[id]};});
        var response=await fetch("/api/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:items})});
        var data=await response.json();
        if(!response.ok || !data.url || !/^https:\/\/checkout\.stripe\.com\//.test(data.url))throw Error(data.error||"Checkout unavailable.");
        window.location.assign(data.url);
      }catch(err){feedback.textContent=err.message||"Checkout is currently unavailable.";button.disabled=false;}
    });
  }
})();
