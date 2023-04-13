const { ethers } = require("hardhat");

async function main() {
  const OceanToken = await ethers.getContractFactory("OceanToken");
  const oct = await OceanToken.deploy(100000000, 50);

  await oct.deployed();

  console.log(`OceanToken deployed to ${oct.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
