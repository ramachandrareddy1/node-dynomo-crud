let AWS = require('aws-sdk');
let express = require('express');
let router = express.Router();
let config = require('../config/dev');
AWS.config.update(config.aws);

let docClient = new AWS.DynamoDB.DocumentClient();
let table = "test_ram";
router.get('/create', (req, res) => {
    let name = 'ramachandra1';
    let age = 28;
    let params = {
        TableName: table,
        Item: {
            "name": name,
            "age": age,
            "address": {
                "plot": "Nothing happens at all.",
                "state": 'andhraPradesh'
            }
        }
    };
    console.log("Adding a new item...");
    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            handleError(err, res);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            handleSuccess('data is added succcessfully', res);
        }
    });
});



router.get('/fetch', (req, res) => {

    let name = 'ramachandra1';
    let params = {
        TableName: table,
        Key: {
            name: name
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            handleError(err, res);
        } else {
            handleSuccess(data.Item, res);
        }
    });
});

router.get('/update',(req,res)=>{
    let name='ramachandra1'
    var params = {
        TableName:table,
        Key:{
            "name": name,
          },
        UpdateExpression: "set address.hno = :r, address.city=:p, address.pincode=:a",
        ExpressionAttributeValues:{
            ":r":5.5,
            ":p":"kurnool.",
            ":a":518553
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            handleError(err,res);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            handleSuccess(data,res);
        }
    });
});


//query and scan method in dynomoDB

router.get('/query',(req,res)=>{
    let params = {
        TableName : table,
        KeyConditionExpression: "#name=:name  AND #age >:age",
        ExpressionAttributeNames:{
            "#age": "age",
            '#name':'name'
        },
        ExpressionAttributeValues: {
            ":age": 27,
            ":name":"ramachandra1"
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.year + ": " + item.title);
            });
        }
    });

});

function handleError(err, res) {
    res.json({ 'message': 'server side error', statusCode: 500, error: err });
}

function handleSuccess(data, res) {
    res.json({ message: 'success', statusCode: 200, data: data })
}


module.exports = router;