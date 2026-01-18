export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Only allow GET requests for security
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // 2. Query all users from the database
      // We sort by 'id' descending so you see the newest registrations first
      const { results } = await env.DB.prepare(
        "SELECT * FROM users ORDER BY id DESC"
      ).all();

      // 3. Return the data as JSON
      return new Response(JSON.stringify({
        success: true,
        count: results.length,
        data: results
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allows you to view this from your frontend
        },
      });

    } catch (err) {
      // 4. Error Handling
      return new Response(JSON.stringify({
        success: false,
        error: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
};
