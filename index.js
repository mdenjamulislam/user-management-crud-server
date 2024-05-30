// Here is the main entry point of the application.
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// MongoDB Connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yuxa2nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const userCollection = client.db('usersData').collection('users');

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user: ', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.put('users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = { upset: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                    phoneNumber: updateUser.phoneNumber,
                    address: updateUser.address,
                    photoUrl: updateUser.photoUrl
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// Routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})