const express = require("express");
const cors = require("cors");
const { getPublicKeyFromSignature, getAddressFromPublicKey } = require("./src/cryptoUtils");
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
    const { transaction } = req.body;
    const recipient = transaction.message.recipient;
    const amount = transaction.message.amount;

    // getting sender public key (and address) from signature and message
    const publicKey = getPublicKeyFromSignature(transaction.signature, transaction.message);
    const sender = `0x${getAddressFromPublicKey(publicKey)}`;

    if (!balances[sender]) {
        console.warn(`Sender: ${sender} not found!`);
        res.status(400).send({ message: `Sender: ${sender} not found!` });
        return;
    }

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
