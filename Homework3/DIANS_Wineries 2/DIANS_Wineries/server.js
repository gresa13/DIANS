const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://gresa:Gresa@cluster0.z1ip1ga.mongodb.net/';


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.get('/', (req, res) => {
    
    res.render('firstPage');
});
app.get('/main',async (req,res)=>{
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to the database');


    const database = client.db('wineSpots');
    const collection = database.collection('wineries'); 

    const cursor = collection.find({ name: { $exists: true, $ne: null } });
    const documents = await cursor.toArray();

    const names = documents.map(doc => doc.name);

   
    res.render('main', { names });

   
} finally {
   
    await client.close();
    console.log('Connection to the database closed');
}
res.render('main');
});
app.post('/main', (req, res) => {
  const { userLocation, currentTime } = req.body;

 

  res.json({ success: true });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});
