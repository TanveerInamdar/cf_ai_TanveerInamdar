// cf_ai_bug_sherlock — stable version with correct route priority
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 🔹 1. Handle AI bug analysis first
    if (pathname.startsWith("/api/report") && request.method === "POST") {
      try {
        const data = await request.json();

        const prompt = `Analyze this frontend error and suggest a fix:\n${JSON.stringify(data, null, 2)}`;
        const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt });




        await env.BUG_MEMORY.put(
            `report_${Date.now()}`,
            JSON.stringify({ data, result })
        );

        return new Response(JSON.stringify(result), {
          headers: { "content-type": "application/json" },
        });
      } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message || "AI handler failed" }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    // 🔹 2. Serve demo HTML at root
    if (pathname === "/" || pathname === "/public/index.html") {
      const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>cf_ai_bug_sherlock demo</title>
          <style>
            body { font-family: system-ui; padding: 40px; background: #f9fafb; color: #222; }
            h1 { color: #0078f2; }
            button {
              background: #0078f2; color: white; border: none;
              border-radius: 8px; padding: 10px 16px;
              cursor: pointer; font-size: 16px; transition: 0.2s;
            }
            button:hover { background: #005fcc; }
            .output {
              margin-top: 20px; padding: 15px;
              border: 1px solid #ccc; border-radius: 10px;
              background: #fff; white-space: pre-wrap;
              font-family: monospace; max-width: 700px;
            }
          </style>
        </head>
        <body>
          <h1>cf_ai_bug_sherlock</h1>
          <p>This demo sends a sample frontend bug report to Cloudflare Workers AI (Llama 3.3) and displays the suggested fix.</p>
          <button onclick="reportBug()">Report Bug</button>

          <script>
            async function reportBug() {
              const payload = { error: "TypeError: Cannot read properties of undefined" };
              const btn = document.querySelector("button");
              btn.disabled = true;
              btn.textContent = "Analyzing...";

              try {
                const res = await fetch("/api/report", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(payload)
                });

                if (!res.ok) {
                  const text = await res.text();
                  throw new Error("Server returned " + res.status + ": " + text.slice(0, 100));
                }

                const data = await res.json();
                const aiText = data.response || JSON.stringify(data, null, 2);

                const output = document.createElement("div");
                output.className = "output";
                output.innerHTML = "<strong>AI Analysis:</strong><br>" + aiText;
                document.body.appendChild(output);
              } catch (err) {
                alert("Error: " + err.message);
              } finally {
                btn.disabled = false;
                btn.textContent = "Report Bug";
              }
            }
          </script>
        </body>
      </html>`;
      return new Response(html, { headers: { "content-type": "text/html" } });
    }

    // 🔹 3. Default fallback
    return new Response("Not found", { status: 404 });
  },
};
