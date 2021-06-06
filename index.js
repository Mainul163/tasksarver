const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const fs= require('fs-extra');
require('dotenv').config()
const pass='IcUROdh03eDGe7Zn';
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.end3q.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()

const port= process.env.PORT|| 5000
app.use(cors())
app.use(express.json())
app.use(fileUpload());

app.get('/', function (req, res) {
    res.send(' world')
  })


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("taskdb").collection("products");
  
  app.post('/addpackage',(req,res)=>{
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const description=req.body.description;
    
    const price=req.body.price
    const newImg = file.data;
    const encImg = newImg.toString('base64');
 
    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    const data ={
      name:name,
      des:description,
       email:email,
      img:image,
    
      price:price
    }
    collection.insertOne(data)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  app.get('/showData',(req,res)=>{
      collection.find()
    //   .toArray((err,document)=>{

    //   })
    .toArray((err,documents)=>{
        res.send(documents)
      })
  })
});


 

  app.listen(port,()=>console.log('running'))