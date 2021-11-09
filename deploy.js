import Web3 from '/usr/local/lib/node_modules/web3';
import MyContract from './build/contracts/btc2eth.json';
import HDWalletProvider from '/usr/local/lib/node_modules/@truffle/hdwallet-provider';
const address= '0xd9fe204bF4f66dA2496A2E01734F95e087039dc1';
const privatekey="d062548ceae6fdd57de332bf7c7f4d1de75d087ead602cbe2817531a575b562f";

const init = async()=>{
    const provider = new HDWalletProvider(
        privatekey,
        'https://ropsten.infura.io/v3/9a994242ad0647d09165b540c76094f5'
    );
    const web3 = new Web3(provider);

    let contract = new web3.eth.Contract(
        MyContract.abi,
    );
    contract = await contract
    .deploy({data: MyContract.bytecode})
    .send({from: address});
}
init();
