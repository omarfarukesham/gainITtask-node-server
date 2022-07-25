const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;
                           
// two significant middleware here ..............................................
app.use(cors())
app.use(express.json())

//Mongodb connection code here ....................................................
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sow4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function for all rest api code here..............................................
async function run() {
    try {
        await client.connect();
        const dashboardCollection = client.db('kidsStore').collection('dashboard')
        const productCollection = client.db('kidsStore').collection('productDashboard')
        const piechartCollection = client.db('kidsStore').collection('data1')
        const barchartCollection = client.db('kidsStore').collection('Data2')

        // sales growth data usages api here.......................................
        app.get('/analysis', async (req, res) => {
            const query = {}
            const cursor = dashboardCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        //Product Information Inserted to mongodb from UI...........................
        app.post('/product', async (req, res) => {
            const getData = req.body
            console.log(getData);
            const result = await productCollection.insertOne(getData)
            res.send(result)
        })

        //all product calling from Mongodb to UI...................................
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // dashboard pieChart designing rest api code here .............................
        app.get('/picChart', async (req, res) => {
            const query = {}
            const cursor = piechartCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // dashboard BARCHART designing rest api code here .............................
        app.get('/barChart', async (req, res) => {
            const query = {}
            const cursor = barchartCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

    
    }
    finally { }
}
run().catch(console.dir)



//initial api caller.............................................................
app.get('/', (req, res) => {
    res.send('Node js is ready to work...........')
})

//port listen to server..........................................................
app.listen(port, () => {
    console.log('Dashboard Server running on the PORT::', port)
})