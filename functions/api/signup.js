export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    // 1. Get the data sent from your form
    const data = await request.json();

    // 2. Insert the data into your D1 'users' table
    // We use env.DB because that is the name of your binding in the screenshot
    await env.DB.prepare(`
      INSERT INTO users (full_name, email, whatsapp, password, role, department, timing, qualification, experience, proposed_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name, 
      data.email, 
      data.whatsapp, 
      data.password, 
      data.role, 
      data.department || null, 
      data.timing || null, 
      data.qc || null, 
      data.ex || null, 
      data.fee || null
    ).run();

    // 3. Return a success message back to the website
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    // If something goes wrong, return the error
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
