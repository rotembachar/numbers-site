# Numbers — Minimal Black & White (GitHub Pages + Supabase)


A ultra-minimal site where anyone can **buy the next number in sequence**.
This starter is static (GitHub Pages) and uses **Supabase** for a tiny, safe counter.


## Live stack
- **Frontend:** Static HTML/CSS/JS (GitHub Pages)
- **Backend:** Supabase Postgres + RPC (no server to manage)


---


## 1) Create your Supabase project
1. Go to Supabase and create a project.
2. Copy your **Project URL** and **anon public key** (Settings → API).
3. Open the SQL Editor and run the contents of `supabase.sql` once.


This creates:
- `settings` table that holds `next_number` (starts at 1)
- `purchases` table to log reserved numbers
- `reserve_next_number()` function that atomically reserves and returns the next number
- RLS policies to allow reading `settings` and calling the function from the browser


> You can reset the counter by running: `update settings set next_number = 1 where id = 1;`


---


## 2) Configure the frontend
Edit `app.js` and set:
```js
const SUPABASE_URL = "https://YOUR-PROJECT-ref.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
const STRIPE_CHECKOUT_URL = ""; // optional for later
