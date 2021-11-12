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


        // Get api place
        app.get('/products', async (req, res) => {
            const cursor = garciacollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })


        // POST API place
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
