const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
        await client.connect();

        // database
        const database = client.db("onlineLearningDB");

        // collection
        const coursesCollection = database.collection("courses");

        // test api
        app.get("/courses", async (req, res) => {
            const result = await coursesCollection.find().toArray();
            res.send(result);
        });
        app.post("/courses", async (req, res) => {

            const newCourse = req.body;

            const result = await coursesCollection.insertOne(newCourse);

            res.send(result);
        });

        app.delete("/courses/:id", async (req, res) => {

            const id = req.params.id;

            const query = { _id: new ObjectId(id) };

            const result = await coursesCollection.deleteOne(query);

            res.send(result);
        });
        app.get("/my-courses", async (req, res) => {

            const email = req.query.email;

            const query = {
                instructorEmail: email,
            };

            const result = await coursesCollection.find(query).toArray();

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