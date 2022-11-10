const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// json web token
// const jwt = require('jsonwebtoken');

//Middle Wares

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l1ydak8.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('homefood').collection('services');

        const reviewCollection = client.db('homefood').collection('reviews');
        
        
        // create services API
        app.post('/services', async(req, res) => {
            const query = req.body;
            const result = await serviceCollection.insertOne(query);
            res.send(result);
        });

        // // read services API
        // // loading server data for client site
        app.get('/services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = {_id: ObjectId(id)};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/allservices', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allservices = await cursor.toArray();
            res.send(allservices);
        });

        // create reviews API
        app.post('/reviews', async(req, res) => {
            const query = req.body;
            const result = await reviewCollection.insertOne(query);
            res.send(result);
        });

        app.get('/reviews', async(req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const remain = await reviewCollection.deleteOne(query)
            res.send(remain)
        });

        // Update data
        app.get("/myreviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.findOne(query)
            res.send(result)
        });

        // update 
        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: query
            }
            const result = await reviewCollection.updateOne(filter, updateDoc)
            res.send(result);
        });
    }
    finally{

    }
}
run().catch( error => console.error(error))




app.get('/', (req, res) => {
    res.send('Home food website is running')
})

app.listen(port, () => {
console.log(`Home food website is running on port ${port}`)})