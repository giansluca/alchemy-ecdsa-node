import { useState } from "react";
import server from "./server";
import { PropTypes } from "prop-types";
import { sign } from "./utils/walletUtils";

// tom      pk --> bac34000eba46cf05997bd7ce337f1e82745b8a978acfddbca675976bf1f217b
// jacob    pk --> 54bae0565d1683c5a2414dfefd9df7a43ec3c69cc8c867eb562f7ebf95e86ece
// samuel   pk --> d7f10461d1e0fd753b5315a0ca50d20b22da9d804bf61a5159fdd5733c1b84fb

const Transfer = ({ setBalance, privateKey }) => {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    const transfer = async (evt) => {
        evt.preventDefault();

        const message = {
            amount: parseFloat(sendAmount),
            recipient,
        };

        const signature = sign(message, privateKey);

        const transaction = {
            message: message,
            signature: signature,
        };

        try {
            const {
                data: { balance },
            } = await server.post("/send", { transaction: transaction });

            setBalance(balance);
        } catch (ex) {
            alert(ex.response.data.message);
        }
    };

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <input type="submit" className="button" value="Transfer" />
        </form>
    );
};

Transfer.propTypes = {
    address: PropTypes.string,
    setBalance: PropTypes.func,
    privateKey: PropTypes.string,
};

export default Transfer;
