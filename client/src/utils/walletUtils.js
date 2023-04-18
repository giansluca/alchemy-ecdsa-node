import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { publicKeyConvert } from "ethereum-cryptography/secp256k1-compat";
import { toHex } from "ethereum-cryptography/utils";
import { utf8ToBytes } from "ethereum-cryptography/utils";

export const getAddressFromPublicKey = (publicKey) => {
    if (publicKey.length !== 65 && publicKey.length !== 33) throw new Error("Invalid public key");

    if (publicKey.length === 33) {
        // public key is compressed
        publicKey = _decompressPublicKey(publicKey);
    }

    const key = publicKey.slice(1);
    const hashKey = keccak256(key);
    const address = hashKey.slice(hashKey.length - 20, key.length);

    return toHex(address);
};

function _decompressPublicKey(publicKey) {
    if (publicKey.length !== 33) throw new Error("Invalid compressed public key");
    return publicKeyConvert(publicKey, false);
}

export const sign = (message, privateKey) => {
    if (privateKey.length != 64) throw new Error("Invalid Private key");

    const byteMessage = utf8ToBytes(JSON.stringify(message));
    const messageHash = keccak256(byteMessage);
    const signature = secp256k1.sign(messageHash, privateKey);

    return { hex: signature.toCompactHex(), recovery: signature.recovery };
};
