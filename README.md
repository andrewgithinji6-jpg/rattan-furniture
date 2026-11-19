# Rattan Furniture Kenya: Cloudflare Pages version

Folders
- `public/`    the website (storefront, admin page, photos, starter data)
- `functions/` the backend (Cloudflare Pages Functions): admin, orders, M-Pesa STK push, visitor stats, Instagram feed

## 1. Put the project on GitHub
Create a repo (for example `rattan-furniture`) and push this folder's contents (`public`, `functions`, `README.md`) to it.
Do not commit passwords or keys.

## 2. Create the Pages project
Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git > pick the repo.
- Framework preset: None
- Build command: (leave empty)
- Build output directory: public
Click Save and Deploy. Name the project `rattan-furniture` if you can (the site becomes rattan-furniture.pages.dev).
If you pick another name, replace `rattan-furniture.pages.dev` in `public/index.html` (2 places, the link-preview tags).
(Dashboard drag-and-drop uploads cannot include the backend. Use Git, or the Wrangler command in section 7.)

## 3. Create the storage (KV) and connect it
1. Workers & Pages > KV > Create namespace > name it `rattan-data`.
2. Your Pages project > Settings > Bindings > Add > KV namespace.
   - Variable name: RATTAN (exactly, capitals)
   - KV namespace: rattan-data
   Save. Do this for Production (and Preview if you use it).

## 4. Add the variables (the same ones you had on Netlify)
Pages project > Settings > Variables and Secrets > Add. Use type Secret for the ones marked S.

| Name | Type | Value |
|---|---|---|
| ADMIN_PASSWORD | S | your admin password (new or old) |
| SESSION_SECRET | S | long random text (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") |
| MPESA_ENV | Text | sandbox or production |
| MPESA_CONSUMER_KEY | S | from the Daraja app |
| MPESA_CONSUMER_SECRET | S | from the Daraja app |
| MPESA_SHORTCODE | Text | sandbox 174379, live: business paybill or till store number |
| MPESA_PASSKEY | S | sandbox passkey from Daraja, live: from Safaricom |
| MPESA_TRANSACTION_TYPE | Text | CustomerPayBillOnline (paybill) or CustomerBuyGoodsOnline (till) |
| MPESA_PARTYB | Text | till number (till only) |
| MPESA_TEST_AMOUNT | Text | optional, 1 = every order charges KES 1 (demos only; delete for real sales) |
| IG_ACCESS_TOKEN | S | optional, Instagram photo feed (see section 6) |

## 5. Redeploy, then test
Variables and bindings only apply to a new deployment: Deployments > latest > ... > Retry deployment (or push any commit).
1. Open https://YOUR-SITE.pages.dev/api/data : you should see {"error":"none"}.
2. Open /admin, sign in, go to Site settings and press Save once (this publishes the starter products).
3. Open the Delivery tab and set your real fees. Open Products and replace the sample prices.
4. Make one test payment (see section 8).

## 6. Instagram feed (optional)
- The Instagram username (Site settings in the admin) gives a "Follow us" link in the footer and on the home page.
- The photo feed needs an Instagram Business or Creator account and an access token from a Meta developer app
  (developers.facebook.com > Create app > add Instagram > API setup with Instagram login > generate token).
  Meta changes these screens often, so follow their current guide. Put the token in IG_ACCESS_TOKEN and redeploy.
  The site refreshes the token by itself about weekly (tokens last 60 days) and caches the feed for 30 minutes.

## 7. Command line deploy (alternative to Git)
Run from this folder:
  npx wrangler login
  npx wrangler pages project create rattan-furniture --production-branch main
  npx wrangler pages deploy public --project-name rattan-furniture
  npx wrangler pages secret put ADMIN_PASSWORD --project-name rattan-furniture   (repeat for each secret)
The KV binding (section 3) is still set in the dashboard.

## 8. M-Pesa notes
- The callback address is built automatically from your site address (/api/pay-callback). Nothing to register for STK push.
- Sandbox only works with Safaricom's test numbers. Real payments need the business's own shortcode and Safaricom go-live approval.
- Order amounts are worked out on the server: items + delivery fee for the chosen location (free above the threshold if you set one).

## 9. Good to know
- Admin changes can take up to a minute to appear for every visitor (KV is eventually consistent).
- Visitor statistics in the admin are approximate. For exact numbers also switch on Cloudflare Web Analytics (Pages project > Metrics).
- Your products and orders from Netlify do not transfer. Re-enter products in the admin, or keep the starter list.
- Custom domain: Pages project > Custom domains. Then update the address in the link-preview tags in `public/index.html`.
