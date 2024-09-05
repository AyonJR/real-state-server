const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000 

// middlewares 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dm99p5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
  
    const houseCollection = client.db('realState').collection('houses')
    const usersCollection = client.db("realState").collection("users");
    const wishCollection = client.db("realState").collection("wishes");



// ! houses collection

app.get("/houses" , async(req,res)=>{
    const result = await houseCollection.find().toArray()
    res.send(result)
})


// ! fetching the details

app.get("/details/:id" , async(req,res)=> {
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await houseCollection.findOne(query)
    res.send(result)


})

// ! fetching users wishlist

app.get("/myWishlist/:email" , async(req,res)=> {
  const email = req.params.email
  const query = {email : email}
  const result = await wishCollection.find(query).toArray()
  res.send(result)


})




// ! post operation of signed-up  users
 
app.post('/users' , async(req,res) => {
  const user = req.body 

  // insert email if user doesnt exits
  const query = {email : user.email}
  const existingUser = await usersCollection.findOne(query)
  if(existingUser){
    return res.send({message : 'user already exists', insertedId : null})
  }

  const result = await usersCollection.insertOne(user)
  res.send(result)
})

//  ! adding wishlist 

app.post('/wishes' , async(req,res) => {
  const user = req.body 
  const result = await wishCollection.insertOne(user)
  res.send(result)
 
})

//  ! deleting from wishlist

app.delete("/myWishlist/:id" , async(req,res)=> {
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await wishCollection.deleteOne(query)
  res.send(result)


})





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get("/" , (req ,res )=> {
    res.send("real state is running")
})

app.listen(port , ()=> {
    console.log(`app is running on the port ${port}`)
})