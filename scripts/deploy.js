const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("./tokens.json")

async function main() {

    //map addresses whitelisted in array (from token.js)
    let tab = [];
    tokens.map(token => {
        tab.push(token.address)
    })
    //create leave (each address is a leave)
    const leaves = tab.map(address => keccak256(address))

    //create tree
    const tree = new MerkleTree(leaves, keccak256, { sort: true});

    //create root
    const root = tree.getHexRoot();


    // We get the contract to deploy
    const Raffle = await hre.ethers.getContractFactory("ERC721Merkle");
    //passing data to contract (constructor)
    const raffle = await Raffle.deploy("CHARACTER", "CHR", root);
    //deploy contract
    await raffle.deployed();

    console.log("Raffle deployed to:", raffle.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
