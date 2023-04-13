// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract OceanToken is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;

    constructor(
        uint256 _cap,
        uint256 _reward
    ) ERC20("OceanToken", "OCT") ERC20Capped(_cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(msg.sender, 70000000 * (10 ** decimals()));
        blockReward = _reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _mint(
        address _account,
        uint256 _amount
    ) internal virtual override(ERC20, ERC20Capped) {
        require(ERC20.totalSupply() + _amount <= cap(), "Cap exceeded");
        super._mint(_account, _amount);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _value
    ) internal virtual override {
        if (
            _from != address(0) &&
            _to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(_from, _to, _value);
    }

    function setBlockReward(uint256 _reward) public _onlyOnwer {
        blockReward = _reward * (10 ** decimals());
    }

    function destroy() public _onlyOnwer {
        selfdestruct(owner);
    }

    modifier _onlyOnwer() {
        require(msg.sender == owner, "not an owner");
        _;
    }
}
