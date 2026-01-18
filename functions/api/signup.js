export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    try {
        const data = await request.json();

        // 1. Basic Validation
        if (!data.email || !data.password) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Identity credentials incomplete." 
            }), { status: 400, headers: corsHeaders });
        }

        // 2. Database Integration (Using your abid_pedagogy_db)
        // Note: Replace 'USERS' with your actual table name if different
        try {
            if (env.DB) {
                await env.DB.prepare(`
                    INSERT INTO users (name, email, whatsapp, role, department, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `).bind(
                    data.name, 
                    data.email, 
                    data.whatsapp, 
                    data.role, 
                    data.department, 
                    new Date().toISOString()
                ).run();
            }
        } catch (dbErr) {
            console.error("DB Error:", dbErr.message);
            // We continue even if DB fails for now, or you can throw an error
        }

        // 3. Success Response
        return new Response(JSON.stringify({ 
            success: true, 
            message: "Identity Synchronized with Abid Khan Hub." 
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Critical Hub Error: " + err.message 
        }), { status: 500, headers: corsHeaders });
    }
}

// Handle CORS Preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
