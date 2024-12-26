// Creating an Asset sample code
const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Horizon.Server('http://127.0.0.1:8000', { allowHttp: true });

var issuingKeys = StellarSdk.Keypair
    .fromSecret('');

var receivingKeys1 = StellarSdk.Keypair
    .fromSecret('');
var receivingKeys2 = StellarSdk.Keypair
    .fromSecret('');

var USD = new StellarSdk.Asset('{asset id}', '{public key}');



server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(receivingKeys1.publicKey())
            .then(function (account) {
                console.log("Account is", account);
                var transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: 'Standalone Network ; February 2017' })
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: USD,
                        limit: '100000',
                        source: receivingKeys1.publicKey()
                    })).setTimeout(100)
                    .build();


                transaction.sign(receivingKeys1);
                return server.submitTransaction(transaction);
            })
    }).catch(function (error) {
        console.error('Error!', error);
    });

server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(receivingKeys2.publicKey())
            .then(function (account) {
                console.log("Account is", account);
                var transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: 'Standalone Network ; February 2017' })
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: USD,
                        limit: '100000',
                        source: receivingKeys2.publicKey()
                    })).setTimeout(100)
                    .build();


                transaction.sign(receivingKeys2);
                return server.submitTransaction(transaction);
            })
    }).catch(function (error) {
        console.error('Error!', error);
    });
    