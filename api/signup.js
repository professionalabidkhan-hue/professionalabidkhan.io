import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('Abid_ELearning_Hub');
    const collection = db.collection('students');

    const { name, email, role, whatsapp, password } = req.body;

    // Save the student
    await collection.insertOne({
      name,
      email,
      role,
      whatsapp,
      password, // In Phase 2, we will add encryption here!
      joined_at: new Date()
    });

    res.status(200).json({ message: 'Identity Secured in Master Core' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
