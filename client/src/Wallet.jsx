import server from "./server";
import { PropTypes } from "prop-types";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { getAddressFromPublicKey } from "./utils/walletUtils";

const Wallet = ({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) => {
    const onChange = async (evt) => {
        const privateKey = evt.target.value;
        setPrivateKey(privateKey);

        if (privateKey.length != 64) return;

        const publicKey = secp256k1.getPublicKey(privateKey, false);
        address = `0x${getAddressFromPublicKey(publicKey)}`;
        setAddress(address);

        if (address) {
            const {
                data: { balance },
            } = await server.get(`/balance/${address}`);

            setBalance(balance);
        } else {
            setBalance(0);
        }
    };

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Private key
                <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
            </label>

            <div>Address: {address}</div>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
};

Wallet.propTypes = {
    address: PropTypes.string,
    setAddress: PropTypes.func,
    balance: PropTypes.number,
    setBalance: PropTypes.func,
    privateKey: PropTypes.string,
    setPrivateKey: PropTypes.func,
};

export default Wallet;
