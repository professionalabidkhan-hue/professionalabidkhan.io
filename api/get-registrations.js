export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    if (url.pathname === "/api/signup" && request.method === "POST") {
      try {
        const data = await request.json();

        // 1. Attempt to write to the Database
        const result = await env.DB.prepare(`
          INSERT INTO users (
            full_name, email, whatsapp, password, role, 
            department, timing, qualification, experience, 
            expected_revenue, proposed_fee
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name || null, 
          data.email || null, 
          data.whatsapp || null, 
          data.password || null, 
          data.role || 'student', 
          data.department || null, 
          data.timing || null, 
          data.qc || null, 
          data.ex || null, 
          null, 
          data.fee || null
        ).run();

        // 2. SUCCESS LOGIC
        if (result.success) {
          return new Response(JSON.stringify({ 
            success: true, 
            message: "REGISTRATION IS SUCCESSFUL! Identity secured in the Master Core." 
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          throw new Error("Database acknowledged but failed to commit.");
        }

      } catch (err) {
        // 3. ERROR LOGIC
        console.error(`[${timestamp}] SIGNUP ERROR: ${err.message}`);
        
        let errorMessage = "REGISTRATION FAILED: ";
        if (err.message.includes("UNIQUE")) {
          errorMessage += "This email is already registered.";
        } else {
          errorMessage += err.message;
        }

        return new Response(JSON.stringify({ 
          success: false, 
          error: errorMessage 
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
