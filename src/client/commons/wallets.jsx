import Web3 from "web3";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import ProviderEngine from "web3-provider-engine/dist/es5";
import FetchSubprovider from "web3-provider-engine/dist/es5/subproviders/fetch";

// configuration can be overrided by env variables
const rpcUrl = process.env.REACT_APP_NETWORK_URL || "https://ropsten.infura.io/U6nLFW0jl1tqsOBnf8MW";
const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || "3", 10);

export const getReadOnlyWeb3 = async () => {
  const engine = new ProviderEngine();
  engine.addProvider(new FetchSubprovider({ rpcUrl }));
  engine.start();
  return new Web3(engine);
};

// we define all wallets exposing a way to get a web3 instance. feel free to adapt.
export const wallets = [
  {
    name: "Ledger device",
    // create a web3 with the ledger device
    getWeb3: () => {
      const engine = new ProviderEngine();
      const getTransport = () => TransportU2F.create();
      const ledger = createLedgerSubprovider(getTransport, {
        networkId,
        accountsLength: 5
      });
      engine.addProvider(ledger);
      engine.addProvider(new FetchSubprovider({ rpcUrl }));
      engine.start();
      return new Web3(engine);
    }
  },
  {
    name: "web3 runtime (MetaMask / Mist)",
    // detect extension like Mist/MetaMask
    getWeb3: () => {
      const web3 = window.web3;
      if (!web3) throw new Error("no web3 instance found in runtime");
      return new Web3(web3.currentProvider);
    }
  }
];
