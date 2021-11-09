// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}


interface IGateway {
    function mint(bytes32 _pHash, uint256 _amount, bytes32 _nHash, bytes calldata _sig) external returns (uint256);
    function burn(bytes calldata _to, uint256 _amount) external returns (uint256);
}

interface IGatewayRegistry {
    function getGatewayBySymbol(string calldata _tokenSymbol) external view returns (IGateway);
    function getTokenBySymbol(string calldata _tokenSymbol) external view returns (IERC20);
}

contract btc2eth {
  IGatewayRegistry public registry;

    event Deposit(uint256 _amount, bytes _msg);

    constructor(IGatewayRegistry _registry) public {
        registry = _registry;
    }

    function deposit(
        // Parameters from users
        bytes calldata _msg,
        // Parameters from RenVM
        uint256        _amount,
        bytes32        _nHash,
        bytes calldata _sig
    ) external {
        bytes32 pHash = keccak256(abi.encode(_msg));
        uint256 mintedAmount = registry.getGatewayBySymbol("BTC").mint(pHash, _amount, _nHash, _sig);
        emit Deposit(mintedAmount, _msg);
    }

    function balance() public view returns (uint256) {
        return registry.getTokenBySymbol("BTC").balanceOf(address(this));
    }
}
