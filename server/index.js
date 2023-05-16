const express = require("express");
const cors = require("cors");
const { getPublicKeyFromSignature, getAddressFromPublicKey, verifySignature } = require("./src/cryptoUtils");
const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    "0x770bf7308f055fee4c880cd24f4d8970fa0950ad": 105, // tom address
    "0x116a190a70697ff704c28d37ab1f5feccee2aa2e": 52, // jacob address
    "0xf4d699adfd6c30ec0d4e1c01cfdeaac5a00b5cf0": 79, // samuel address
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    try {
        const { transaction } = req.body;
        const recipientAddress = transaction.message.recipient;
        const amount = transaction.message.amount;

        // getting sender public key (and address) from signature and message and verify
        const senderPublicKey = getPublicKeyFromSignature(transaction.signature, transaction.message);
        if (!senderPublicKey) {
            console.warn("Error extracting public key from signature");
            res.status(400).send({ message: "Error extracting public key from signature" });
        }

        const isVerified = verifySignature(transaction.signature, transaction.message, senderPublicKey);
        if (!isVerified) {
            console.warn("Signature not verified!");
            res.status(400).send({ message: "Signature not verified!" });
        }

        const senderAddress = `0x${getAddressFromPublicKey(senderPublicKey)}`;
        if (!balances[senderAddress]) {
            console.warn(`Sender: ${senderAddress} not found!`);
            res.status(400).send({ message: `Sender: ${senderAddress} not found!` });
            return;
        }

        console.log(`Sender address: ${senderAddress} OK - Signature verified: ${isVerified}`);

        if (balances[senderAddress] < amount) {
            console.warn("Not enough funds!");
            res.status(400).send({ message: "Not enough funds!" });
            return;
        }

        if (!balances[recipientAddress]) {
            console.warn(`Recipient: ${recipientAddress} not found!`);
            res.status(400).send({ message: `Recipient: ${recipientAddress} not found!` });
            return;
        }

        balances[senderAddress] -= amount;
        balances[recipientAddress] += amount;
        res.send({ balance: balances[senderAddress] });
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
