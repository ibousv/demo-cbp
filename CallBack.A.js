const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pg = require('pg');
const conString = "postgres://postgres:postgres@localhost:5432/banka";
const client = new pg.Client(conString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    // Header config
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS,PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content - type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

client.connect();

// Endpoints 
app.post('/compliance/fetch_info', function (request, response) {
    var addressParts = request.body.address.split('*');
    var friendlyId = addressParts[0];

    client.query('SELECT name,address,dob,domain from users where friendlyid = $1', [friendlyId], (error, results) => {
        if (error) {
            throw error
        }

        if (results) {
            response.json({
                name: results.rows[0].name,
                address: results.rows[0].address,
                date_of_birth: (results.rows[0].dob).toString(),
                domain: results.rows[0].domain
            });
            response.end();
        }
    });
});

app.post('/compliance/sanctions', function (request, response) {
    var sender = JSON.parse(request.body.sender)
    client.query('SELECT * from sanction where domain = $1',
        [sender.domain], (error, results) => {
            if (error) {
                response.status(403).end("FI not sanctioned");
            }
            if (results) {
                response.status(200).end();
            }
        })
});

app.post('/compliance/ask_user', function (request, response) {
    var sender = JSON.parse(request.body.sender)
    client.query('SELECT * from sanction where domain = $1',
        [sender.domain], (error, results) => {
            if (error) {
                response.status(403).end("FI not sanctioned");
            }
            if (results) {
                if (results.rows[0].kyc == true) {
                    response.status(200).end();
                }
                else {
                    response.status(403).end("KYC request denied");
                }
            }
        })
});

app.post('/receive', function (request, response) {
    var amount = parseInt(Number(request.body.amount).toFixed(2));
    var friendlyid = request.body.route;
    var SendObj = JSON.parse(request.body.data);
    var kycObj = JSON.parse(SendObj.attachment);
    client.query('INSERT INTO transactions(txid, sender, receiver,amount, currency, kyc_info) VALUES($1, $2, $3, $4, $5, $6)',
        [request.body.transaction_id, SendObj.sender, request.body.route, amount, request.body.asset_code, kycObj.transaction.sender_info], (error,
            results) => {
        if (error) {
            console.log(error);
            response.status(500).end("Error inserting transaction");
        }
        if (results) {
            client.query('SELECT balance from users where friendlyid = $1',
                [friendlyid], (error, results) => {
                    if (error) {
                        console.log(error);
                        response.status(500).end("Not found");
                    }
                    if (results) {
                        var balance = Number(results.rows[0].balance)
                        balance = balance + + amount;
                        client.query('UPDATE users set balance = $1 where friendlyid = $2',
                            [balance, friendlyid], (error, results) => {
                                if (error) {
                                    console.log(error);
                                    response.status(500).end("Not found");
                                }
                                if (results) {
                                    response.status(200).end();
                                }
                            })
                    }
                })
        }
    })
});

