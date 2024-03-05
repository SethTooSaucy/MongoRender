const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = 3000;
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/say/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

app.get('/api/mongo/:item', async (req, res) => {
  const client = new MongoClient(uri);
  const searchKey = req.params.item;

  try {
    await client.connect();
    const database = client.db('Sethdb');
    const parts = database.collection('SethStuff');

    const part = await parts.findOne({ partID: searchKey });
    if (!part) {
      res.status(404).send('Item not found');
      return;
    }
    res.send('Found this: ' + JSON.stringify(part));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});


