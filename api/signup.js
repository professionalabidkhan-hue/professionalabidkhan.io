import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('Abid_ELearning_Hub');
    const collection = db.collection('students');

    // Destructure all fields from the Master Form
    const { 
      name, email, role, whatsapp, password, 
      department, timing, fee, joined_at 
    } = req.body;

    // Build the Identity Document
    const identityDocument = {
      name,
      email,
      role, // 'student' or 'trainer'
      whatsapp,
      password, // Note: In production, consider bcrypt for password hashing
      department, // 'IT' or 'QURAN'
      timing,
      proposed_fee: fee,
      account_status: 'pending_verification',
      joined_at: joined_at || new Date()
    };

    // Insert into the Sacred Database
    await collection.insertOne(identityDocument);

    res.status(200).json({ 
      success: true, 
      message: `Identity Secured in ${department} Department.` 
    });

  } catch (error) {
    console.error("Master Core Error:", error);
    res.status(500).json({ error: "Failed to initialize identity." });
  } finally {
    await client.close();
  }
}
