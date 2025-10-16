# cf_ai_bug_sherlock

**AI-powered debugging assistant built on Cloudflare Workers.**  
This project captures frontend bug reports and analyzes them with **Cloudflare Workers AI (Llama 3.1 8B)** to explain the cause and suggest a fix.

---

## 🧠 What It Does

When a user clicks **“Report Bug”**, the Worker:
1. Captures a simulated frontend error.
2. Sends it to Workers AI for analysis.
3. Displays an explanation and suggested fix right in the browser.
4. Stores the report in a KV Namespace for reference.

---

## 🧩 Architecture Overview

```
[ Browser ]
│
│ (1) "Report Bug" → sends JSON payload
▼
[ Cloudflare Worker ]
│
│ (2) Calls Workers AI → @cf/meta/llama-3.1-8b-instruct
▼
[ Workers AI Model ]
│
│ (3) Returns analysis + fix suggestion
▼
[ Worker ]
│
│ (4) Saves record → KV Namespace (BUG_MEMORY)
▼
[ Browser ]
│
│ (5) Displays formatted "AI Analysis" box
```

---

## 🚀 Setup (LOCAL BUILD ONLY)

You do **not** need to deploy this project.  
It runs locally and temporarily uses Cloudflare’s remote AI during testing.

### 1️⃣ Clone and install
```bash
git clone https://github.com/<your-username>/cf_ai_bug_sherlock.git
cd cf_ai_bug_sherlock
npm install
```

### 2️⃣ Configure `wrangler.toml`

Make sure it looks like this:

```toml
name = "cf_ai_bug_sherlock"
main = "src/worker.js"
compatibility_date = "2025-10-01"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "BUG_MEMORY"
id = "<YOUR_KV_NAMESPACE_ID>"
preview_id = "<YOUR_KV_PREVIEW_ID>"
```

The KV IDs can stay as placeholders for local testing.  
No secret keys or tokens are needed.

### 3️⃣ Enable Workers AI (once)
Go to Cloudflare Dashboard → **Workers AI**,  
and make sure Workers AI is enabled on your account.

### 4️⃣ Run the project locally (in remote mode)
```bash
npx wrangler dev --remote
```

This launches your Worker on Cloudflare’s edge temporarily so it can access the AI model.  
Wait until Wrangler shows:

```
[wrangler:inf] Ready on http://127.0.0.1:8787
```

### 5️⃣ Test the demo

Visit:
```
http://127.0.0.1:8787/
```

Click “Report Bug”.  
You’ll see an **AI Analysis** box appear below the button with an explanation and suggested fix.

### 6️⃣ Stop the server
Press `Ctrl + C` in the terminal to stop Wrangler.

---

## ⚙️ Configuration Details

| Component | Purpose |
|------------|----------|
| Workers AI Binding (`env.AI`) | Runs `@cf/meta/llama-3.1-8b-instruct` model |
| KV Namespace (`BUG_MEMORY`) | Stores recent bug reports |
| Compatibility Date | `2025-10-01` |
| Language | JavaScript (ES Modules) |

---

## 🔒 Security Notes

No API keys, tokens, or credentials are included.  
`wrangler.toml` only contains resource IDs, which are safe to commit.  
The `.wrangler/` folder stores local config and should be ignored.

Add a small `.gitignore` file:

```
node_modules/
.wrangler/
dist/
```

---

## 🧩 Example Output

```
AI Analysis:
The error "TypeError: Cannot read properties of undefined" occurs when trying to
access a property on an undefined object. Ensure variables are initialized or add
a null check before accessing properties.
```

---

## 💡 Future Improvements

- Add `/dashboard` route to view KV-stored bug reports.  
- Integrate with GitHub or Linear for automatic issue creation.  
- Extend LLM prompt chain for root-cause + code patch generation.

---

## 📄 License

MIT © 2025 Tanveer Siddharth Inamdar
