export async function onRequest(context) {
  const { request, env } = context;
  const h = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });

  try {
    const { email, password } = await request.json();
    if (!env.DB) return new Response(JSON.stringify({ error: "Database not bound" }), { status: 500, headers: h });

    // Look up the user in your new abid-pedagogy-db
    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ success: false, error: "Invalid Credentials" }), { status: 401, headers: h });
    }

    // Don't send the password back to the browser
    const { password: _, ...safeUser } = user;
    return new Response(JSON.stringify({ success: true, user: safeUser }), { status: 200, headers: h });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: h });
  }
}
