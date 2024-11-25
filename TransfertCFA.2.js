// After the transaction 
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Horizon.Server('http://127.0.0.1:8000', { allowHttp: true });

let issuingKeys = StellarSdk.Keypair
    .fromSecret('SCR7LJNJ2GLJNRLQKP3626YBO2OBKHK2YWCO6W3JSGBSIU2HRHWC33UF');

let receivingKeys2 = StellarSdk.Keypair
    .fromSecret('SCO54YN5WO7OHKQ4RU7POYARR4KNY3UKTMBFBPRCFH36LZDGMPDA4DMZ');

let CFA = new StellarSdk.Asset("CFA", issuingKeys.publicKey());

server.fetchBaseFee()
    .then(function (fee) {
        console.log("Fee is", fee);
        server.loadAccount(issuingKeys.publicKey())
            .then(async function (account) {
                var transaction = new StellarSdk.TransactionBuilder(account, {
                    fee, networkPassphrase: 'Standalone Network ; February 2017'
                })
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receivingKeys2.publicKey(),
                        asset: CFA,
                        amount: '800000'
                    })).setTimeout(100)
                    .build();
                transaction.sign(issuingKeys);
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
