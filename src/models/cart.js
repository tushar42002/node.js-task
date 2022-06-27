const express = require('express');
const mongoose = require("mongoose");





const cartSchema = new mongoose.Schema({

       title: {
                type:String,
                required:true
        },
        product_id : {
                type:String,
                required:true
        },
        store_id : {
                type:String,
                required:true,
                unique:true
        },
        price : {
                type:Number,
                required:true
        },
        quantity : {
                type:Number,
                required:true
        }
});




module.exports = cartSchema;