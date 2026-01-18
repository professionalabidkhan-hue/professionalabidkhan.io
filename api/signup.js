export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const data = await request.json();

    // 1. Check if the database binding "DB" is connected
    if (!env.DB) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Database Connection Missing (Check Cloudflare Bindings)" 
      }), { status: 500 });
    }

    // 2. Insert into the D1 'users' table
    await env.DB.prepare(`
      INSERT INTO users (full_name, email, whatsapp, password, role, department, timing, qualification, experience, proposed_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name, data.email, data.whatsapp, data.password, 
      data.role, data.department, data.timing, 
      data.qc, data.ex, data.fee
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "IDENTITY SECURED IN MASTER CORE" 
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    let errorMsg = err.message;
    // Friendly message for duplicate emails
    if (errorMsg.includes("UNIQUE constraint")) {
        errorMsg = "This Email is already registered in the Hub.";
    }
    
    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
