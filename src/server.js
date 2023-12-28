import express from 'express';
import { MongoClient } from 'mongodb';
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

const url = 'mongodb+srv://jeremyqinsa:600186Qd%21%21@cluster0.xm7uvh0.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);

let cartItems = cartItemsRaw;
let products = productsRaw;

const app = express();
app.use(express.json());

async function populatedCartArray (cartIds) {
    await client.connect();
    const db = client.db('ECommerceApp-db');
    // console.log(cartIds);

    return Promise.all(cartIds.map((id) => db.collection('products').findOne({id})));
}


app.get('/products', async (req,res) => {
    await client.connect();
    const db = client.db('ECommerceApp-db');

    products = await db.collection('products').find({}).toArray();
    res.send(products);
})

app.get('/users/:userId/cart', async (req,res) => {

    await client.connect();
    const db = client.db('ECommerceApp-db');

    const user = await db.collection('users').findOne({id: req.params.userId});
    const cartArray = await populatedCartArray(user.cartItems);
    
    res.json(cartArray);
})

app.post('/cart', (req,res) => {
    const productId = req.body.id;
    cartItems.push(productId);
    const cartArray = populatedCartArray(cartItems);
    res.json(cartArray);    
})

app.delete('/cart/:productId', (req,res) => {
    const productId = req.params.productId;
    console.log(productId);
    cartItems = cartItems.filter((id) => id !== productId);
    const cartArray = populatedCartArray(cartItems);
    res.json(cartArray);
});

app.get('/products/:productId', (req,res) => {
    const productId = req.params.productId;
    const product = products.find((product) => product.id === productId);
    res.json(product);
})

app.listen(8000, () => {
    console.log('Server is runing on 8000');
})