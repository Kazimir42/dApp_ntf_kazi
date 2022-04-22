import {useEffect, useState} from "react";
import {ethers} from 'ethers';
import Contract from './artifacts/contracts/ERC721Merkle.sol/ERC721Merkle.json'
import './App.css';
import InfosAccount from "./components/InfosAccount";
import AddWhitelist from "./components/AddWhitelist";

const {MerkleTree} = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("./tokens.json")

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
    const [countData, setCountData] = useState(0);
    const [loader, setLoader] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [price, setPrice] = useState();
    const [balance, setBalance] = useState();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getAccounts();
        setLoader(false);
        getPrice();
        getCount();
    }, [])

    //little security to check if app realy try to connect to MM
    window.ethereum.addListener('connect', async (response) => {
        getAccounts();
    });

    //refresh page if user switch account
    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    });

    //refresh page if user switch network
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });

    //refresh page if user disconnect
    window.ethereum.on('disconnect', () => {
        window.location.reload();
    });

    //get number of user whitelisted
    function getCount() {

    }

    //get price of NFT
    async function getPrice() {
        if (typeof window.ethereum !== 'undefined') {
            let chainId = await window.ethereum.request({method: 'eth_chainId'})
            if (chainId === "0x1" || chainId === "0x3" || chainId === "0x4" || chainId === "0x5" || chainId === "0x2a" || chainId === "0x539") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                //get the contract
                const contract = new ethers.Contract(address, Contract.abi, provider);
                try {
                    //call function getPrice of contract
                    const data = await contract.getPrice();
                    setPrice(data)
                }catch(error) {
                    console.log(error)
                }
            }
        }
    }

    async function getAccounts() {
        //get account
        if (typeof window.ethereum !== 'undefined') {
            //get the chain id to check if nice network
            let chainId = await window.ethereum.request({method: 'eth_chainId'})
            if (chainId === "0x1" || chainId === "0x3" || chainId === "0x4" || chainId === "0x5" || chainId === "0x2a" || chainId === "0x539") {
                let accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                setAccounts(accounts);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                //get the eth balance in WEI of connected account
                const balance = await provider.getBalance(accounts[0]);
                // balance WEI -> ETH
                const balanceInEth = ethers.utils.formatEther(balance)
                setBalance(balanceInEth);
            } else {
                setError('Wrong network')
            }
        } else {
            setError('Not connected')
        }
    }


    async function mint() {
        if (typeof window.ethereum !== 'undefined') {
            //get the chain id to check if nice network
            let chainId = await window.ethereum.request({method: 'eth_chainId'})
            if (chainId === "0x1" || chainId === "0x3" || chainId === "0x4" || chainId === "0x5" || chainId === "0x2a" || chainId === "0x539") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                //need signer cuz whe change data in blockchain
                const signer = provider.getSigner();
                const contract = new ethers.Contract(address, Contract.abi, signer);
                //get addresses who can mint
                let tab = [];
                tokens.map(token => {
                    tab.push(token.address)
                })
                //hash address to be a leave (leaves is an array of hashed addresses who can mint NFT)
                const leaves = tab.map(address => keccak256(address))

                //create tree
                const tree = new MerkleTree(leaves, keccak256, { sort: true});

                //create a leaf for the current connected account
                const leaf = keccak256(accounts[0]);

                //create proof of merkle
                const proof = tree.getHexProof();

                try {
                    let overrides = {
                        from: accounts[0],
                        value: price
                    }
                    //call function mintNFT of contract
                    const transaction = await contract.mintNTF(accounts[0], proof, overrides)
                    await transaction.wait();
                }catch(error) {
                    console.log(error)
                }

            }
        }
    }

    return (
        <div className="App">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button className="connect_btn" onClick={getAccounts}>Connect Metamask</button>
            <InfosAccount loader={loader} accounts={accounts} balance={balance} error={error}/>
            <AddWhitelist countData={countData} setCountData={setCountData} getCount={getCount} balance={balance}
                          setBalance={setBalance} setError={setError} setSuccess={setSuccess} accounts={accounts}/>
            <button onClick={mint}>MINT ONE NFT</button>
        </div>
    );

}

export default App;
