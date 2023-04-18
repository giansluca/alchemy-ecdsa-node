function generateKeyPair() {
    const { secp256k1 } = require("ethereum-cryptography/secp256k1");
    const { toHex } = require("ethereum-cryptography/utils");
    const { getAddressFromPublicKey } = require("./cryptoUtils");

    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey, false);
    const address = getAddressFromPublicKey(publicKey);

    console.log("private key:", toHex(privateKey));
    console.log("public key:", toHex(publicKey));
    console.log("address: ", `0x${address}`);
}

generateKeyPair();
