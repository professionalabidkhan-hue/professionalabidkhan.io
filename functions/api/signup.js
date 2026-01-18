export async function onRequest(context) {
  const { request, env } = context;
  const h = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  try {
    const d = await request.json();
    if (!env.DB) return new Response(JSON.stringify({ error: "DB Missing" }), { status: 500, headers: h });
    await env.DB.prepare("INSERT INTO users (name, email, whatsapp, password, role, department, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(d.name, d.email, d.whatsapp || "", d.password, d.role || "student", d.department || "IT", new Date().toISOString()).run();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: h });
  }
}
