const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// le client postgres pointe sur la base de donnee
const pg = require('pg');
const conString =
    "postgres://bankauser:bankauser@localhost:5432/banka";
const requestObj = require('request');
const client = new pg.Client(conString);
// Remplacer par ton asset 
const USD = 'USD';
// Remplacer par la cle public du issuer ou issuingkeys
const issuer =
    '';
var txid = 1001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS,PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-RequestedWith,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var server = app.listen(process.env.PORT || 3600, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// Pour obtenir les details de l'utilisateur
app.post('/userdet', function (request, response) {
    var idParts = request.body.friendlyid.split('*');
    var friendlyId = idParts[0];
    client.query('SELECT name,balance from users where friendlyid =$1',
        [friendlyId], (error, results) => {
            if (error) {
                throw error
            }
            if (results) {
                response.json({
                    name: results.rows[0].name,
                    balance: results.rows[0].balance
                });
                response.end();
            }
        })
})

// Pour obtenir le montant du compte
app.post('/userbal', function (request, response) {
    var idParts = request.body.friendlyid.split('*');
    var friendlyId = idParts[0];
    client.query('SELECT balance from users where friendlyid = $1',
        [friendlyId], (error, results) => {
            if (error) {
                throw error
            }
            if (results) {
                response.json({
                    balance: results.rows[0].balance
                });
                response.end();
            }
        });
});

// Pour obtenir les payments
app.post('/payment', function (request, response) {
    var idParts = request.body.account.split('*');
    var friendlyId = idParts[0];
    client.query('SELECT balance from users where friendlyid = $1',
        [friendlyId], (error, results) => {
            if (error) {
                response.json({
                    msg: "ERROR!",
                    error_msg: error
                });
                response.end();
            }
            if (results) {
                balance = results.rows[0].balance;
                if (balance < Number(request.body.amount)) {
                    response.json({
                        msg: "ERROR!",
                        error_msg: "Insufficient balance!"
                    });
                    response.end();
                }
                requestObj.post({
                    url: 'http://localhost:8006/payment',
                    form: {
                        id: txid.toString(),
                        amount: request.body.amount,
                        asset_code: USD,
                        asset_issuer: issuer,
                        destination: request.body.receiver,
                        sender: request.body.account,
                        use_compliance: true
                    }
                },
                    function (err, res, body) {
                        if (err || res.statusCode !== 200) {
                            console.error('ERROR!', err || body);
                            response.json({
                                result: body,
                                msg: "ERROR!",
                                error_msg: err
                            });
                            response.end();
                        }
                        else {
                            console.log('SUCCESS!', body);
                            client.query('SELECT balance from users where friendlyid = $1',
                                [friendlyId], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        response.status(500).end("User Not found");
                                    }

                                    if (results) {
                                        var balance = Number(results.rows[0].balance)
                                        balance = balance + - request.body.amount;
                                        client.query('UPDATE users set balance = $1 where friendlyid = $2',
                                            [balance, friendlyId], (error, results) => {
                                                if (error) {
                                                    console.log(error);
                                                    response.status(500).end("User Not found");
                                                }
                                                if (results) {
                                                    response.json({
                                                        result: body,
                                                        msg: 'SUCCESS!'
                                                    });
                                                    txid++;
                                                    console.log("Next txid", txid);
                                                    response.status(200).end();
                                                }
                                            })
                                    }
                                })
                        }
                    });
            }
        })
});

// Pour obtenir la listes des transactions
app.get('/bankuser', function (request, response) {
    client.query('SELECT * from transactions', (error, results) => {
        if (error) {
            throw error
        }
        if (results) {
            response.json({
                tx: results.rows
            });
            response.end();
        }
    })
});

