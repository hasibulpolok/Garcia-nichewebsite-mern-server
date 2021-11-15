const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aeutd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db('garcia');
        const garciacollection = database.collection('productlist');
        const userbooking = database.collection('userbooking');
        const userreviews = database.collection('userreviews');
        const usersCollection = database.collection('users');






        // Get api Reviews
        app.get('/reviews', async (req, res) => {
            const cursor = userreviews.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        // POST API reviews
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await userreviews.insertOne(reviews);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });





        // Get api Book
        app.get('/book', async (req, res) => {
            const cursor = userbooking.find({});
            const booking = await cursor.toArray();
            res.json(booking);
        });

        // get specifiq user order 
        app.get('/book/:email', async (req, res) => {
            const email = req.params.email;
            const result = userbooking.find({ User: email });
            const order = await result.toArray();
            res.json(order);
        });

        // serve user to database
        app.post('/users/res', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });

        app.put('/users/res', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const option = { upsert: true }
            const updateDoc = { $set: user }
            const result = await usersCollection.insertOne(filter, updateDoc, option);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });
        // POST API Booking
        app.post('/book', async (req, res) => {
            const bookdetails = req.body;
            const result = await userbooking.insertOne(bookdetails);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });

        // get user isadmin or not 
        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const isAdmin = await usersCollection.findOne(query);
            let userIsAdmin = false;
            if (isAdmin?.role === 'admin') {
                userIsAdmin = true;
            }
            res.send({ admin: userIsAdmin });
        });

        // make admin 
        app.put('user/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateUser = { $set: { role: 'admin' } };
            const data = await usersCollection.updateOne(filter, updateUser);
            res.json(data);
        })

        // Get api Products
        app.get('/products', async (req, res) => {
            const cursor = garciacollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


        // Delete Api book
        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('deleting booking');
            const result = await userbooking.deleteOne(query)
            res.json(result);
        })



        // POST API Products
        app.post('/products', async (req, res) => {
            const newproduct = req.body;
            const result = await garciacollection.insertOne(newproduct);
            res.json(result);
        })






    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("server setup successfully")
    console.log("server running");
})

app.listen(port, () => {
    console.log("runnig server on port", port);
})
