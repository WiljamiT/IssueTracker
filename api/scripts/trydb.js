require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL;

async function testWithAsync() {
    console.log('\n--- testWithAsync ---');
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB', url);

        const db = client.db();
        const collection = db.collection('employees');
        const employee = {
            id: 1,
            name: 'A. Async',
            age: 25
        };

        const result = await collection.insertOne(employee);
        console.log('Result of insert:\n', result.insertedId);

        const docs = await collection.find({ _id: result.insertedId }).toArray();
        console.log('Result of find:\n', docs);
    } finally {
        await client.close();
    }
}

testWithAsync().catch(console.error);