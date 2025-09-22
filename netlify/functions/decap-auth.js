// netlify/functions/decap-auth.js
// Self-hosted OAuth proxy for Decap CMS (GitHub)
exports.handler = async function(event, context) {
  const { 
    GITHUB_CLIENT_ID, 
    GITHUB_CLIENT_SECRET, 
    OAUTH_REDIRECT_URI, 
    GIT_HOSTNAME = "github.com", 
    REPO_FULL_NAME 
  } = process.env;

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
    const scope = "repo"; // use "repo" to support private repositories
    const auth = new URL(`https://${GIT_HOSTNAME}/login/oauth/authorize`);
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
      const tokenRes = await fetch(`https://${GIT_HOSTNAME}/login/oauth/access_token`, {
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
      
      const token = data.access_token;
      console.log("Token entregue ao Decap:", token);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Autenticação</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .loading { color: #333; }
              </style>
            </head>
            <body>
              <div class="loading">
                <h2>Validando login...</h2>
                <p>Aguarde enquanto finalizamos sua autenticação.</p>
              </div>
              <script>
                (function() {
                  function receiveMessage(e) {
                    if (!e.origin.match(window.location.origin)) return;
                    window.opener.postMessage(
                      'authorization:github:success:${JSON.stringify({ token })}',
                      e.origin
                    );
                    window.close();
                  }
                  window.addEventListener('message', receiveMessage, false);
                  window.opener.postMessage('authorization:github:success:${JSON.stringify({ token })}', '*');
                  setTimeout(function() {
                    window.location.replace('/admin/#/'); // volta pro painel Decap
                  }, 200);
                })();
              </script>
            </body>
          </html>
        `
      };
    } catch (e) {
      return respond(500, `<h1>Server error</h1><pre>${escapeHTML(String(e))}</pre>`);
    }
  }

  return respond(404, "<h1>Not found</h1>");
};

function escapeHTML(s) {
  return s.replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
}