const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { publicKeyConvert } = require("ethereum-cryptography/secp256k1-compat");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { Signature } = secp256k1;

function getAddressFromPublicKey(publicKey) {
    if (publicKey.length !== 65 && publicKey.length !== 33) throw new Error("Invalid public key");

    if (publicKey.length === 33) {
        // public key is compressed
        publicKey = decompressPublicKey(publicKey);
    }

    const key = publicKey.slice(1);
    const hashKey = keccak256(key);
    const address = hashKey.slice(hashKey.length - 20, key.length);

    return toHex(address);
}

function decompressPublicKey(publicKey) {
    if (publicKey.length !== 33) throw new Error("Invalid  compressed public key");
    return publicKeyConvert(publicKey, false);
}

function getPublicKeyFromSignature(signature, message) {
    const byteMessage = utf8ToBytes(JSON.stringify(message));
    const messageHash = keccak256(byteMessage);

    const signatureFromHex = Signature.fromCompact(signature.hex).addRecoveryBit(signature.recovery);
    const recoveredPublicKey = signatureFromHex.recoverPublicKey(messageHash).toRawBytes(false);

    return recoveredPublicKey;
}

module.exports = {
    getAddressFromPublicKey: getAddressFromPublicKey,
    getPublicKeyFromSignature: getPublicKeyFromSignature,
};
