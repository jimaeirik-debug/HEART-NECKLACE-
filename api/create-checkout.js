/**
 * Heart & Spooned — separate Shopify store checkout gateway.
 * NO connection to GOOD WEIRD STUFF. Product catalog is disabled until
 * the new Heart & Spooned Shopify store has verified inventory and payments.
 *
 * Required (on the Heart & Spooned Vercel project):
 * SHOPIFY_CHECKOUT_ENABLED=true
 * SHOPIFY_STOREFRONT_DOMAIN=the-heart-and-spooned-store.myshopify.com
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN=... (configure privately in Vercel)
 *
 * Enable products only after seller confirmation and accurate variant IDs.
 */
const CATALOG = Object.freeze({
  "necklace-heart-spoon": { enabled: false, variantId: null },
  "suede-handbag": { enabled: false, variantId: null }
});
const ALLOWED_ORIGINS = new Set(["https://heartandspooned.com","https://www.heartandspooned.com"]);
const CHECKOUT_API_VERSION = "2026-10";

function reply(res,status,body) {
  res.setHeader("Cache-Control","no-store");
  return res.status(status).json(body);
}
export default async function handler(req,res) {
  if (req.method !== "POST") {
    res.setHeader("Allow","POST");
    return reply(res,405,{error:"Only POST requests are supported."});
  }
  const origin=req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return reply(res,403,{error:"Origin not allowed."});
  }
  if (process.env.SHOPIFY_CHECKOUT_ENABLED !== "true") {
    return reply(res,503,{error:"Shopify checkout for Heart & Spooned is not connected yet."});
  }
  const domain=(process.env.SHOPIFY_STOREFRONT_DOMAIN||"").toLowerCase().trim();
  const token=process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN||"";
  if (!/^[a-z0-9][a-z0-9.-]*\.myshopify\.com$/.test(domain)||!token) {
    return reply(res,503,{error:"The Heart & Spooned checkout needs configuration."});
  }
  const body=req.body||{};
  if (!Array.isArray(body.items)||!body.items.length||body.items.length>12) {
    return reply(res,400,{error:"A valid shopping bag is required."});
  }
  const unique=new Map();
  for(const item of body.items) {
    if(!item||typeof item.id!=="string"||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>10) {
      return reply(res,400,{error:"Invalid item or quantity."});
    }
    const product=CATALOG[item.id];
    if(!product||!product.enabled||!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(product.variantId||"")) {
      return reply(res,409,{error:"A product in your bag is not available for purchase."});
    }
    const qty=(unique.get(item.id)||0)+item.quantity;
    if(qty>10) return reply(res,400,{error:"Maximum quantity exceeded."});
    unique.set(item.id,qty);
  }
  const lines=[...unique].map(([id,quantity])=>({merchandiseId:CATALOG[id].variantId,quantity}));
  const query='mutation CartCreate($input:CartInput!){cartCreate(input:$input){cart{id checkoutUrl} userErrors{field message}}}';
  try {
    const response=await fetch("https://"+domain+"/api/"+CHECKOUT_API_VERSION+"/graphql.json",{
      method:"POST",
      headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":token},
      body:JSON.stringify({query,variables:{input:{lines}}})
    });
    if(!response.ok) return reply(res,502,{error:"Shopify checkout is temporarily unavailable."});
    const payload=await response.json();
    const checkout=payload?.data?.cartCreate;
    const url=checkout?.cart?.checkoutUrl;
    if(payload.errors?.length||checkout?.userErrors?.length||typeof url!=="string") {
      return reply(res,409,{error:"The shopping bag could not be checked out. Verify product availability."});
    }
    const parsed=new URL(url);
    if(parsed.protocol!=="https:"||!(parsed.hostname===domain||parsed.hostname.endsWith(".myshopify.com")||parsed.hostname==="checkout.shopify.com"||parsed.hostname.endsWith(".shopify.com"))) {
      return reply(res,502,{error:"Unexpected checkout destination."});
    }
    return reply(res,200,{url:parsed.href});
  } catch(error) {
    console.error("Shopify checkout start failed");
    return reply(res,502,{error:"Secure checkout is temporarily unavailable."});
  }
}
