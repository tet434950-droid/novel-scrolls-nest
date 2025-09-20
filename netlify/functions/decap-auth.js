// netlify/functions/decap-auth.js
// Self-hosted OAuth proxy for Decap CMS (GitHub)
export async function handler(event, context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

  const respond = (status, body, headers = {}) => ({
    statusCode: status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...headers,
    },
    body,
  });

  if (event.httpMethod === "OPTIONS") return respond(204, "");

  const url = new URL(event.rawUrl);
  const pathname = url.pathname;

  // 1) Start OAuth → redirect to GitHub
  if (event.httpMethod === "GET" && (pathname.endsWith("/decap-auth") || pathname.endsWith("/decap-auth/"))) {
    const state = Math.random().toString(36).slice(2, 14);
    const scope = "public_repo"; // use "repo" if repo is private
    const auth = new URL("https://github.com/login/oauth/authorize");
    auth.searchParams.set("client_id", GITHUB_CLIENT_ID);
    auth.searchParams.set("redirect_uri", OAUTH_REDIRECT_URI);
    auth.searchParams.set("scope", scope);
    auth.searchParams.set("state", state);
    return { statusCode: 302, headers: { Location: auth.toString() }, body: "" };
  }

  // 2) Callback → exchange code for token
  if (event.httpMethod === "GET" && pathname.endsWith("/decap-auth/callback")) {
    const params = new URL(event.rawUrl).searchParams;
    const code = params.get("code");
    if (!code) return respond(400, "<h1>Missing code</h1>");
    try {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          redirect_uri: OAUTH_REDIRECT_URI,
          code,
        }),
      });
      const data = await tokenRes.json();
      if (!data.access_token) {
        return respond(400, `<h1>OAuth error</h1><pre>${escapeHTML(JSON.stringify(data))}</pre>`);
      }
      const html = `<!doctype html><meta charset="utf-8" /><title>OAuth</title>
<script>
  (function(){
    try { window.opener && window.opener.postMessage({ token: "${data.access_token}" }, "*"); } catch(e){}
    window.close(); document.write("You can close this window.");
  })();
</script>`;
      return respond(200, html);
    } catch (e) {
      return respond(500, `<h1>Server error</h1><pre>${escapeHTML(String(e))}</pre>`);
    }
  }

  return respond(404, "<h1>Not found</h1>");
}

function escapeHTML(s) {
  return s.replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
}