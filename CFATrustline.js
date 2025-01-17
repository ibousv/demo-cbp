// Force use of async prog due to time delay
// After review the issuer account of CFA asset wasn't receive the asset itself
// The balance as unchanged meanwhile another account id merged and at his place and hold the CFA asset

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Horizon.Server('http://127.0.0.1:8000', { allowHttp: true });

let issuingKeys = StellarSdk.Keypair
    .fromSecret('SCYIWURARVT5PW5A6VT4P2KL66QLVUGZCJSHZ67QMSJG3VXEE6HMTP4K');

let receivingKeys1 = StellarSdk.Keypair
    .fromSecret('SDDGRBBUVNNVJD655PP3S2QDVY6VRM2TRTJOEDEBCVK2CBEJ3OE4I3RW');

let receivingKeys2 = StellarSdk.Keypair
    .fromSecret('SBIJOTZUYETYKGU7DI3CABJREY6PPPXTFPXXTPH67UMMY44BTPJOD2TQ');

let CFA = new StellarSdk.Asset("CFA", issuingKeys.publicKey())

// adding trusline to receiver1
server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(receivingKeys1.publicKey())
            .then(async function (account) {
                console.log("Account is", account);
                let transaction = new StellarSdk.TransactionBuilder(account,
                    { fee, networkPassphrase: 'Standalone Network ; February 2017' })
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: CFA,
                        limit: '1000000',
                        source: receivingKeys1.publicKey()
                    })).setTimeout(100)
                    .build();
                transaction.sign(receivingKeys1);
                return server.submitTransaction(transaction);
            })
    }).catch(function (error) {
        console.error('Error!', error);
    });


// adding trusline to receiver2
server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(receivingKeys2.publicKey())
            .then(async function (account) {
                console.log("Account is", account);
                var transaction = new StellarSdk.TransactionBuilder(account,
                    { fee, networkPassphrase: 'Standalone Network ; February 2017' })
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: CFA,
                        limit: '1000000',
                        source: receivingKeys2.publicKey()
                    })).setTimeout(100)
                    .build();

                transaction.sign(receivingKeys2);
                server.submitTransaction(transaction);
                //changelog -- added await and transaction result
                const transactionResult = await server.submitTransaction(transaction);
                console.log(transactionResult);
            })
    }).catch(function (error) {
        console.error('Error!', error);
    });
