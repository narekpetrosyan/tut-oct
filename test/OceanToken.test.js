const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OceanToken", () => {
  let oct, owner, addr1, addr2;
  const tokenCap = 100000000;
  const tokenBlockReward = 50;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const OCT = await ethers.getContractFactory("OceanToken");
    oct = await OCT.deploy(tokenCap, tokenBlockReward);
    await oct.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await oct.owner()).to.eq(owner.address);
    });

    it("Should assign the totalSupply to the owner", async () => {
      const balance = await oct.balanceOf(owner.address);
      expect(await oct.totalSupply()).to.eq(balance);
    });

    it("Should set the right capacity value", async () => {
      const capacity = await oct.cap();
      expect(Number(ethers.utils.formatEther(capacity))).to.eq(tokenCap);
    });

    it("Should set the right blockReward value", async () => {
      const blockReward = await oct.blockReward();
      expect(Number(ethers.utils.formatEther(blockReward))).to.eq(
        tokenBlockReward
      );
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await oct.transfer(addr1.address, 50);
      const addr1Balance = await oct.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await oct.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await oct.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await oct.balanceOf(owner.address);
      await expect(
        oct.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await oct.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await oct.balanceOf(owner.address);

      await oct.transfer(addr1.address, 100);

      await oct.transfer(addr2.address, 50);

      const finalOwnerBalance = await oct.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await oct.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await oct.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
