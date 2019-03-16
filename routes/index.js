const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongodb = require('mongodb');
const currentUser = require('../config/passport');

// Load Product model
const Product = require('../models/product');

/* GET homepage. */
router.get('/', function (req, res) {

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('products');

            // Find all products
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render('index', {
                        title: 'Big Market',
                        data: result
                    });
                } else {
                    res.render('index', {
                        title: 'Big Market',
                        data: result
                    });
                }
                //Close connection
                db.close();
            });
        }
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res){

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the Server', err);
    } else {
        // Connected
        console.log('Connection established to', url);

        // In order to pull data from database,
        // We need to get the entire database first,
        // Then from there we take the collections we want.
        const productDatabase = db.db('blockchain_market');
        var collection = productDatabase.collection('products');

        // Find all products
        collection.find({sellerID: req.user.username}).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else if (result) {
                res.render('dashboard', {
                    data: result,
                    user: req.user,
                    title: 'Big Market',
                    userUsername: req.user.username,
                    credits: req.user.credits
                });
            } else {
                res.render('dashboard', {
                    user: req.user,
                    title: 'Big Market',
                    userUsername: req.user.username,
                    credits: req.user.credits,
                    data: result
                });
            //Close connection
            db.close();
        }})
    }});
});

// Generate new product
router.post('/dashboard',ensureAuthenticated,function (req, res){
    const {name, price} = req.body;

    const newProduct = new Product({
        sellerID: req.user.username,
        name: name,
        price: price,
    });

    newProduct
        .save()
        .then(product => {
            console.log(product);
            res.redirect('/index-active');
        });

});

// About
router.get('/about', function (req, res) {
    res.render('about', {title: 'Big Market'});
});

// Index when logged in
router.get('/index-active', ensureAuthenticated,function (req, res){

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('products');

            // Find all products
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render('index-active', {
                        title: 'Big Market',
                        data: result,
                        credits: req.user.credits,
                    });
                } else {
                    res.render('index-active', {
                        title: 'Big Market',
                        data: result,
                        credits: req.user.credits,
                    });}
                //Close connection
                db.close();
            });
        }
    });
});

// About when logged in
router.get('/about-active', ensureAuthenticated, (req, res) =>
    res.render('about-active', {
        title: 'Big Market'
    })
);

// Product page
router.get('/product/:productID', ensureAuthenticated, function (req, res){
    const productID = req.params.productID;
    console.log(productID);

    Product.findOne({_id:productID})
        .then(product => {
            if(product){
                res.render('product',{
                    title:'Big Market',
                    product:product
                });
            }else{
                res.send('no product ID found')
            }
        });
});

/* Extra functionality for validation of buyer */
// Check if user has enough money.
function checkBalance(price, balance){
    console.log('price: ', price, 'balance: ',balance);
    return balance >= price;
}

// Can't buy self product.
function verifyOwner(owner, buyer){
    console.log('owner: ', owner, 'buyer: ',buyer);
    return owner !== buyer;
}

// Get seller balance.
function getSellerBalance(seller){

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('users');

            // Find seller
            return collection.find({username: seller}).toArray()
                .then(function(result) {
                    console.log('seller balance found.', result);
                    return result.credits;
                })}

    });
}

// Make a transaction happen in database.
function transaction (productId, buyer, seller, buyerBalance, price) {

    // New balance
    var newBalance = buyerBalance - price;
    console.log(buyerBalance);
    console.log(price);
    console.log(newBalance);

    Product.findOneAndDelete({_id: productId},
        function(err,result){
        if(err) throw err;
        else console.log('item Deleted')
        });

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('users');

            // Update buyer
            collection.findOneAndUpdate({username: buyer},
                {
                    $set: {"credits": newBalance}
                },
                function(err,result){
                if(err){
                    throw err;
                }else{
                    console.log('buyer updated.');
                    return false;
                }
                });

            // Update seller
            // collection.findOneAndUpdate({username: seller},
            //     {
            //         $set: {"credits": sellerBalance}
            //     },
            //     function(err,result){
            //         if(err){
            //             throw err;
            //         }else{
            //             console.log('seller updated.');
            //             return false;
            //         }
            //     });
        }
        //Close connection
        db.close();
    });
    return true;
}

/* extra function end */

router.post('/product/:productID', ensureAuthenticated, function(req,res) {
    const productID = req.params.productID;

    // Find product info
    Product.findOne({_id: productID})
        .then(product => {
        if(product){
            if (!checkBalance(product.price, req.user.credits)) {
                console.log('not enough credits');
                res.send("Sorry, seem like you do not have enough credits, please topup.")
            } else if (!verifyOwner(product.sellerID, req.user.username)) {
                console.log('buying self product');
                res.send('Sorry, you are buying your own product, which is not allowed.')
            } else {
                if(transaction(productID, req.user.username, product.sellerID, req.user.credits, product.price)) {
                    res.redirect('/success/' + product.sellerID +'/' + product.price)
                }}
        }else{
            res.send("Sorry, the product you looking for is not available.");
        }
    });

});

router.get('/success', ensureAuthenticated, function (req,res) {
    res.render('success',{title: 'Big Market'})
});

router.get('/success/:sellerID/:price', ensureAuthenticated, function(req,res){
    var sellerID = req.param.sellerID;
    var price = req.param.price;
    var sellerBalance = getSellerBalance(sellerID);

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('users');

            sellerBalance  += price;

            //Update seller
            collection.findOneAndUpdate({username: sellerID},
                {
                    $set: {"credits": sellerBalance}
                },
                function(err,result){
                    if(err){
                        res.render(err);
                    }else{
                        console.log('seller updated.');
                        res.redirect('/success');
                    }
                });
        }
        //Close connection
        db.close();
    });
});

module.exports = router;
