import Web3 from "web3";
require("dotenv").config();
import usdtABI from "../constants/usdt.json";
const InputDataDecoder = require("ethereum-input-data-decoder");

interface verifyResponse {
  result: boolean;
  error: string;
}

const getByTxHash = async (tx_hash: string) => {
  try {
    //Get Web3 provider
    const web3 = new Web3(process.env.RPC_URL);
    //Get Tx details from blockchain network
    const result = await web3.eth.getTransaction(tx_hash);
    //Decode the input field of the txResult to get the addressTo and value
    return result;
  } catch (error) {
    console.log(error);
    return { result: false, error };
  }
};

export default getByTxHash;
