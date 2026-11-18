
/**
 * Heart & Spooned — Stripe-hosted checkout.
 *
 * SAFETY: No products are enabled for purchase until the owner confirms their
 * product, price, stock, shipping, tax and IP rights. Never trust a browser-sent price.
 *
 * Environment settings (configure directly in the Vercel dashboard):
 * STRIPE_SECRET_KEY, STRIPE_SHIPPING_RATE_ID, STRIPE_PAYMENTS_ENABLED=true,
 * STRIPE_AUTOMATIC_TAX_ENABLED=true.
 */
const SHOP_ORIGIN = "https://heartandspooned.com";
const PRODUCTS = Object.freeze({
  "necklace-heart-spoon": { available: false, priceNokOre: null, name: "Heart & Spoon Necklace" },
  "suede-handbag": { available: false, priceNokOre: null, name: "Suede Handbag" }
});
const allowedOrigins = new Set(["https://heartandspooned.com", "https://www.heartandspooned.com"]);

function json(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(code).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, {error:"Only POST requests are supported."});
  }
  var origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) return json(res, 403, {error:"Origin not allowed."});
  if (process.env.STRIPE_PAYMENTS_ENABLED !== "true" ||
      process.env.STRIPE_AUTOMATIC_TAX_ENABLED !== "true" ||
      !process.env.STRIPE_SECRET_KEY ||
      !process.env.STRIPE_SHIPPING_RATE_ID) {
    return json(res, 503, {error:"Checkout is not available yet. The shop is preparing its payment, tax and delivery settings."});
  }
  var input = req.body && typeof req.body === "object" ? req.body : {};
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 12) {
    return json(res, 400, {error:"A valid shopping bag is required."});
  }
  var quantities = {};
  for (var i = 0; i < input.items.length; i++) {
    var item = input.items[i];
    if (!item || typeof item.id !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
      return json(res, 400, {error:"Invalid product or quantity."});
    }
    var product = PRODUCTS[item.id];
    if (!product || product.available !== true || !Number.isInteger(product.priceNokOre) || product.priceNokOre < 100) {
      return json(res, 409, {error:"One or more products are not currently for sale."});
    }
    quantities[item.id] = (quantities[item.id] || 0) + item.quantity;
    if (quantities[item.id] > 10) return json(res, 400, {error:"Maximum quantity exceeded."});
  }

  var form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", SHOP_ORIGIN + "/checkout-success.html?session_id={CHECKOUT_SESSION_ID}");
  form.set("cancel_url", SHOP_ORIGIN + "/cart.html?checkout_cancelled=1");
  form.set("billing_address_collection", "required");
  form.set("customer_creation", "always");
  form.set("automatic_tax[enabled]", "true");
  form.set("shipping_address_collection[allowed_countries][0]", "NO"); // Expand only after confirmed fulfillment.
  form.set("shipping_options[0][shipping_rate]", process.env.STRIPE_SHIPPING_RATE_ID);
  form.set("metadata[shop]", "heartandspooned.com");
  form.set("metadata[version]", "1");
  var pos = 0;
  for (var id of Object.keys(quantities)) {
    var p = PRODUCTS[id];
    form.set("line_items["+pos+"][price_data][currency]", "nok");
    form.set("line_items["+pos+"][price_data][unit_amount]", String(p.priceNokOre));
    form.set("line_items["+pos+"][price_data][product_data][name]", p.name);
    form.set("line_items["+pos+"][quantity]", String(quantities[id]));
    pos++;
  }

  try {
    var stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method:"POST",
      headers:{"Authorization":"Bearer " + process.env.STRIPE_SECRET_KEY,
               "Content-Type":"application/x-www-form-urlencoded"},
      body:form.toString()
    });
    var result=await stripe.json();
    if (!stripe.ok || typeof result.url !== "string" || !result.url.startsWith("https://checkout.stripe.com/")) {
      console.error("Stripe Checkout creation error", {status:stripe.status, type:result.error && result.error.type});
      return json(res, 502, {error:"Secure checkout could not start. Please try again later."});
    }
    return json(res, 200, {url:result.url});
  } catch (e) {
    console.error("Checkout connection failed");
    return json(res, 502, {error:"Secure checkout is temporarily unavailable."});
  }
}
