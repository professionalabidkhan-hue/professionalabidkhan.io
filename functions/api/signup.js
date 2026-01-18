export async function onRequestPost(context) {
    const { request } = context;

    // Standard headers for JSON and CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        // Parse the incoming JSON data from your signup.html
        const body = await request.json();

        // VALIDATION LOGIC
        if (!body.email || !body.password) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Missing required fields." 
            }), { status: 400, headers });
        }

        // TODO: Here is where you would save to D1 or KV
        // For now, we return a success signal
        return new Response(JSON.stringify({ 
            success: true, 
            message: "Identity synchronized with Cloudflare." 
        }), { status: 200, headers });

    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Server failed to process request: " + err.message 
        }), { status: 500, headers });
    }
}

// Handle OPTIONS request for CORS preflight
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
