// After the transaction 
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Horizon.Server('http://127.0.0.1:8000', { allowHttp: true });

let receivingKeys1 = StellarSdk.Keypair
    .fromSecret('SBESOHJWCBL2IQDC7XLSTI2ZCUHIXP7HUHEXMBZA6SS5EFV7AQQSPFRG');

let receivingKeys2 = StellarSdk.Keypair
    .fromSecret('SDMPBXDEK3CTAFHSCR462MUH4GAYXLTFVV4AGD6JSIC47KUIT4ZI5YXM');

let CFA = new StellarSdk.Asset("CFA", "GAM3H64KRRRR7MALID4SWQVKJ43RREFR7WGQCTWWTQEEWQD3J44HLSDJ");

server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(receivingKeys1.publicKey())
            .then(async function (account) {
                var transaction = new StellarSdk.TransactionBuilder(account, {
                    fee, networkPassphrase: 'Standalone Network ; February 2017'
                })
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receivingKeys2.publicKey(),
                        asset: CFA,
                        amount: '1000'
                    })).setTimeout(100)
                    .build();
                transaction.sign(receivingKeys1);
                return server.submitTransaction(transaction);
            }).then(function (response, error) {
                if (response) {
                    console.log("Response", response);
                }
                else {
                    console.log("Error", error);
                }
            })
    });
