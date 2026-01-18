export async function onRequest(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const data = await request.json();
        if (!env.DB) {
            return new Response(JSON.stringify({ success: false, error: "Database Link Missing" }), { status: 500, headers: corsHeaders });
        }

        await env.DB.prepare(
            "INSERT INTO users (name, email, whatsapp, password, role, department, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            data.name, data.email, data.whatsapp, data.password, data.role || 'student', data.department || 'general', new Date().toISOString()
        ).run();

        return new Response(JSON.stringify({ success: true, message: "Identity Synchronized" }), { status: 200, headers: corsHeaders });

    } catch (err) {
        let msg = err.message;
        if (msg.includes("UNIQUE")) msg = "Email already registered.";
        return new Response(JSON.stringify({ success: false, error: msg }), { status: 500, headers: corsHeaders });
    }
}
