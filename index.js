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
            res.send(booking);
        });

        // POST API Booking
        app.post('/book', async (req, res) => {
            const bookdetails = req.body;
            const result = await userbooking.insertOne(bookdetails);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });


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
