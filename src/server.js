import express from 'express';
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

let cartItems = cartItemsRaw;
let products = productsRaw;

const app = express();
app.use(express.json());

function populatedCartArray (cartIds) {
    return  cartIds.map((id) => products.find((product) => product.id === id));
}

app.get('/products', (req,res) => {
    res.send(products);
})

app.get('/cart', (req,res) => {
    // let cartArray = [];
    // cartItems.forEach(element => {
    //     let items = products.filter((product) => product.id === element);
    //     cartArray.push(items);
    // });

    // res.json(cartArray);
    const cartArray = populatedCartArray(cartItems);
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