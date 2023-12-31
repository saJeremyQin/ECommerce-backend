import express from 'express';
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

let cartItems = cartItemsRaw;
let products = productsRaw;

const app = express();
app.use(express.json());

app.get('/products', (req,res) => {
    res.send(products);
})

app.get('/cart', (req,res) => {
    res.json(cartItems);
})

app.post('/cart', (req,res) => {
    const productId = req.body.id;
    const product = products.find((product) => product.id === productId);
    cartItems.push(product);
    res.json(cartItems);    
})

app.delete('/cart/:productId', (req,res) => {
    const productId = req.params.productId;
    console.log(productId);
    cartItems = cartItems.filter((cartItem) => cartItem.id !== productId);
    res.json(cartItems);
});

app.get('/products/:productId', (req,res) => {
    const productId = req.params.productId;
    const product = products.find((product) => product.id === productId);
    res.json(product);
})

app.listen(8000, () => {
    console.log('Server is runing on 8000');
})