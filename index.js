const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nkerzi4.mongodb.net/onlineLearningDB?retryWrites=true&w=majority&appName=Cluster0`;

// mongodb client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {

        // connect mongodb
        // await client.connect();

        // database
        const database = client.db("onlineLearningDB");

        // collection
        const coursesCollection = database.collection("courses");

        // test api
        app.get("/courses", async (req, res) => {
            const result = await coursesCollection.find().toArray();
            res.send(result);
        });
        app.get("/add-test", async (req, res) => {

            const testData = {
                title: "React Course",
                instructor: "Arif",
                price: 499,
            };

            const result = await coursesCollection.insertOne(testData);

            res.send(result);
        });

        // ping
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB Connected Successfully");

    } finally {

    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Online Learning Server Running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});