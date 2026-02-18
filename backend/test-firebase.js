const { db } = require('./config/firebaseConfig');

async function testConnection() {
    try {
        if (!db) {
            console.error("Database not initialized.");
            process.exit(1);
        }
        console.log("Attempting to write to Firestore...");
        await db.collection('test_connection').doc('ping').set({
            timestamp: new Date(),
            status: 'connected'
        });
        console.log("Successfully wrote to Firestore!");
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error.message);
        process.exit(1);
    }
}

testConnection();
