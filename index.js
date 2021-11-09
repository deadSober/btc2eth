import Web3 from "/usr/local/lib/node_modules/web3";
import MyContract from "./build/contracts/btc2eth.json";
import RenJS from "@renproject/ren";
import { Bitcoin, Ethereum } from "@renproject/chains";

const init = async ()=>{
	let web3Provider;

    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        this.logError("Please allow access to your Web3 wallet.");
        return;
      }
    }
    else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    }
    else {
      return;
    }

    const web3 = new Web3(web3Provider);
	const contract = new web3.eth.Contract(
		MyContract.abi,
		contractAddress
	);
	const balance = await contract.methods.balance().call();
	// const addresses = await web3.eth.getAccounts();
	// console.log(addresses);
	// const receipt = await contract.methods.setData(10).send({
	// 	from: addresses[0],
	// });
	// const data = await contract.methods.getData().call();
	// console.log(receipt);

	deposit = async () => {
		const web3 = new Web3(web3Provider);
		const renJS = new RenJS({ useV2TransactionFormat: true });
		const amount = balance; // BTC
		const mint = await renJS.lockAndMint({
		  asset: "BTC",
		  from: Bitcoin(),
		  to: Ethereum(web3.currentProvider).Contract({
			sendTo: contractAddress,
	
			contractFn: "deposit",
	
			contractParams: [
			  {
				name: "_msg",
				type: "bytes",
				value: Buffer.from(`Depositing ${amount} BTC`),
			  },
			],
		  }),
		});
		mint.on("deposit", async (deposit) => {
	
		  const hash = deposit.txHash();
		  const depositLog = (msg) =>
			console.log(
			  `BTC deposit: ${Bitcoin.utils.transactionExplorerLink(
				deposit.depositDetails.transaction,
				"testnet"
			  )}\n
			  RenVM Hash: ${hash}\n
			  Status: ${deposit.status}\n
			  ${msg}`
			);
	
		  await deposit
			.confirmed()
			.on("target", (target) => depositLog(`0/${target} confirmations`))
			.on("confirmation", (confs, target) =>
			  depositLog(`${confs}/${target} confirmations`)
			);
	
		  await deposit
			.signed()
			.on("status", (status) => depositLog(`Status: ${status}`));
	
		  await deposit
			.mint()
			.on("transactionHash", (txHash) => depositLog(`Mint tx: ${txHash}`));
	
		  console.log(`Deposited ${amount} BTC.`);
		});
	  };
}; 
init();