import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://jeremyqinsa:600186Qd%21%21@cluster0.xm7uvh0.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);

const app = express();
app.use(cors());

app.use(express.json());

async function populatedCartArray (cartIds) {
    await client.connect();
    const db = client.db('ECommerceApp-db');
    console.log(cartIds);
    // cocurrently execute multiple promises and wait them to resolve, and will be resolved to an array of documents
    const promises = Promise.all(cartIds.map((id) => db.collection('products').findOne({id})));
    return promises;
}


app.get('/api/products', async (req,res) => {
    await client.connect();
    const db = client.db('ECommerceApp-db');

    const products = await db.collection('products').find({}).toArray();
    res.send(products);
})

app.get('/api/users/:userId/cart', async (req,res) => {
    await client.connect();
    const db = client.db('ECommerceApp-db');

    // user is an object representing a user document from the "users" collection in MongoDB
    const user = await db.collection('users').findOne({id: req.params.userId});
    const cartArray = await populatedCartArray(user.cartItems);
    
    res.json(cartArray);
})

app.get('/api/products/:productId', async (req,res) => {
    await client.connect();
    const db = client.db('ECommerceApp-db');

    const productId = req.params.productId;
    const product = await db.collection('products').findOne({id:productId});
    res.json(product);
})


app.post('/api/users/:userId/cart', async (req,res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    await client.connect();
    const db = client.db('ECommerceApp-db');

    await db.collection('users').updateOne(
        {
            id: userId
        },
        {
            $addToSet: 
            {
                cartItems: productId
            }
        }
    )

    const user = await db.collection('users').findOne({id: userId});
    const cartArray = await populatedCartArray(user.cartItems);
    res.json(cartArray);    
})

app.delete('/api/users/:userId/cart/:productId',async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    

    await client.connect();
    const db = client.db('ECommerceApp-db');

    await db.collection('users').updateOne(
        {
            id: userId
        },
        {
            $pull:
            {
                cartItems:productId
            }
        }
    )
    const user = await db.collection('users').findOne({id: userId});
    const cartArray = await populatedCartArray(user.cartItems);
    res.json(cartArray);    
});

app.listen(8000, () => {
    console.log('Server is runing on 8000');
})