export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle Signup Requests
    if (url.pathname === "/api/signup" && request.method === "POST") {
      try {
        const data = await request.json();
        
        // Insert user into D1 Database
        await env.DB.prepare(`
          INSERT INTO users (full_name, email, whatsapp, password, role, department, timing, qualification, experience, expected_revenue, proposed_fee)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name, data.email, data.whatsapp, data.password, 
          data.role, data.department, data.timing, 
          data.qc || null, data.ex || null, data.expected_revenue || null, data.fee || null
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Handle Signin Requests
    if (url.pathname === "/api/signin" && request.method === "POST") {
      const { email, password } = await request.json();
      
      const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password = ?")
        .bind(email, password)
        .first();

      if (user) {
        return new Response(JSON.stringify({ name: user.full_name, email: user.email }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    // 3. Serve Static Files (Default behavior)
    return env.ASSETS.fetch(request);
  }
};
