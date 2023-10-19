// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const crossChainNFT = await hre.ethers.getContractFactory("ICrossTalkNFT");
  const crossChainNFTContract = await crossChainNFT.deploy("www.picsum.photos/600","0x7B3B890f7B428B724e4b821C193c456496f7C7b7","0xeC2265da865A947647CE6175a4a2646318f6DCEb");

  await crossChainNFTContract.deployed();

  console.log("CrossChainNFT deployed to:", crossChainNFTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
