"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../database.js').User;
const jwt = require('jsonwebtoken');
const config = require('../config');
const Order = require('../database.js').Order;
const ObjectId = require('mongodb').ObjectID;
var VerifyToken = require('../authontication/AuthController.js');
//get all orders that state is pending
router.get('/allorder_d', function (req, res) {
    Order.find({ state: "pending" }).exec((err, order) => {
        if (err) {
            console.log(err);
            req.send();
        }
        res.json(order);
    });
    var id = req.user_id;
});
//make the state prepared.
router.post('/state_prepared', function (req, res) {
    var id_order = req.body._id;
    Order.findOneAndUpdate({ _id: ObjectId(id_order) }, { $set: { state: "prepared" } }, { useFindAndModify: false }).then((data) => {
        if (data === null) {
            throw new Error('Order Not Found');
        }
        res.json({ message: 'Order updated!' });
        console.log("New order data", data);
    }).catch((error) => {
        /*
            Deal with all your errors here with your preferred error handle middleware / method
         */
        res.status(500).json({ message: 'Some Error!' });
        console.log(error);
    });
});
//accept the order
router.post('/accept_order', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err)
            return res.status(500).send("There was a problem finding the user.");
        if (!user)
            return res.status(404).send("No user found.");
        var id = user._id;
        // var order = {
        //   driver_id:id
        // }
        var id_order = req.body._id;
        console.log(id_order);
        console.log(id);
        Order.findOneAndUpdate({ _id: ObjectId(id_order) }, { $set: { driver_id: ObjectId(id) } }, { useFindAndModify: false }).then((data) => {
            if (data === null) {
                throw new Error('Order Not Found');
            }
            res.json({ message: 'Order updated!' });
            console.log("New order data", data);
        }).catch((error) => {
            /*
                Deal with all your errors here with your preferred error handle middleware / method
             */
            res.status(500).json({ message: 'Some Error!' });
            console.log(error);
        });
    });
});
//get the current order
router.get('/current_order_d', VerifyToken, function (req, res) {
    Order.find({ state: "prepared" }).exec((err, order) => {
        if (err) {
            console.log(err);
            req.send();
        }
        res.json(order);
    });
});
//get the previous orders
router.get('/previous_order_d', VerifyToken, function (req, res) {
    Order.find({ state: "previous" }).exec((err, order) => {
        if (err) {
            console.log(err);
            req.send();
        }
        res.json(order);
    });
});
module.exports = router;
//# sourceMappingURL=order_d.js.map